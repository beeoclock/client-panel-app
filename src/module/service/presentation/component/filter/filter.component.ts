import {Component} from '@angular/core';
import {FilterPanelComponent} from '@utility/presentation/component/panel/filter.panel.component';
import {SearchInputComponent} from '@utility/presentation/component/input/search.input.component';
import {debounceTime, firstValueFrom, map} from "rxjs";
import {Store} from "@ngxs/store";
import {FilterForm} from "@service/presentation/form/filter.form";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {MS_HALF_SECOND} from '@src/module/utility/domain/const/c.time';
import {IonSelectActiveComponent} from "@utility/presentation/component/input/ion/ion-select-active.component";
import {clearObjectClone} from "@utility/domain/clear.object";
import {Reactive} from "@utility/cdk/reactive";
import {ServiceState} from "@service/state/service/service.state";

@Component({
	selector: 'service-filter-component',
	standalone: true,
	imports: [
		FilterPanelComponent,
		SearchInputComponent,
		TranslateModule,
		RouterLink,
		PrimaryButtonDirective,
		IonSelectActiveComponent
	],
	template: `
		<utility-filter-panel-component>
			<div class="flex items-center gap-3" start>
				<utility-search-input-component [control]="form.controls.phrase"/>
				<ion-select-active [control]="form.controls.active"/>
			</div>
			<ng-container end>
				<button type="button" primary routerLink="form">
					<i class="bi bi-plus-lg"></i>
					{{ 'keyword.capitalize.add-service' | translate }}
				</button>
			</ng-container>
		</utility-filter-panel-component>
	`
})
export class FilterComponent extends Reactive {
	public readonly form = new FilterForm();

	constructor(
		public readonly store: Store,
	) {
		super();
		this.store.select(ServiceState.tableState)
			.pipe(
				this.takeUntil(),
			)
			.subscribe(({filters}) => {
				Object.keys(filters).forEach((key) => {
					this.form.controls[key].patchValue(filters[key]);
				})
			});
		this.form.valueChanges.pipe(
			debounceTime(MS_HALF_SECOND),
			map(clearObjectClone)
		).subscribe(async (value) => {
			this.form.disable({
				emitEvent: false,
				onlySelf: true
			});
			await firstValueFrom(this.store.dispatch(new ServiceActions.UpdateFilters(value as any)));
			await firstValueFrom(this.store.dispatch(new ServiceActions.GetList()));
			this.form.enable({
				emitEvent: false,
				onlySelf: true
			});
		});
	}
}
