import {afterRender, Component, inject, input, OnInit, signal, ViewEncapsulation} from '@angular/core';
import {Actions, ofActionErrored, ofActionSuccessful, Store} from "@ngxs/store";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";
import {TranslatePipe} from "@ngx-translate/core";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	TenantPluginDataActions
} from "@tenant/plugin/tenant-plugin/infrastructure/state/data/tenant-plugin.data.actions";
import {tap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {GetFunctionsApi} from "@tenant/plugin/tenant-plugin/infrastructure/data-source/api/get-functions.api";

@Component({
	selector: 'plugin-detail-page',
	templateUrl: './plugin-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		StandardDetailsEntityComponent,
		TranslatePipe,
	],
	standalone: true
})
export class PluginDetailsContainerComponent implements OnInit {

	public readonly item = input.required<ETenantPlugin>();

	private readonly actions = inject(Actions);
	public readonly store = inject(Store);
	public readonly router = inject(Router);
	public readonly activatedRoute = inject(ActivatedRoute);
	public readonly getFunctionsApi = inject(GetFunctionsApi);

	public readonly loading = signal<boolean>(false);

	private readonly successfulActionsSubscription = this.actions.pipe(
		ofActionSuccessful(
			TenantPluginDataActions.Detach,
		),
		tap((action) => {
			if (action.payload._id !== this.item()._id) return;
			setTimeout(() => {
				this.loading.set(false);
				this.router.navigate([{outlets: {second: []}}]).then()
			}, 500);
		})
	).subscribe();

	private readonly erroredActionsSubscription = this.actions.pipe(
		ofActionErrored(
			TenantPluginDataActions.Detach,
		),
		tap(({action}) => {
			if (action.payload._id !== this.item()._id) return;
			this.loading.set(false);
		})
	).subscribe();

	public constructor() {
		afterRender(() => {
		});
	}

	public ngOnInit() {
		this.getFunctionsApi.executeAsync(this.item().plugin.slug).then((response) => {
			console.log({response})
		});
	}

	public detach() {
		this.loading.set(true);
		this.detachPlugin();
	}

	@Dispatch()
	private detachPlugin() {
		return new TenantPluginDataActions.Detach(this.item());
	}

}

export default PluginDetailsContainerComponent;
