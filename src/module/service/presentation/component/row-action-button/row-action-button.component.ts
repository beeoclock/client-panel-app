import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule} from "@ngx-translate/core";
import {Router, RouterLink} from "@angular/router";
import {IService} from "@service/domain";

@Component({
	selector: 'service-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action [id]="id" (delete)="delete($event)">
			<li>
				<a
					[routerLink]="['../', 'event', 'form']"
					[queryParams]="{serviceId: item._id, returnUrl}"
					class="flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
					<i class="bi bi-calendar2-week"></i>
					{{ 'keyword.capitalize.add-event' | translate }}
				</a>
			</li>
		</utility-table-column-action>
	`,
	imports: [
		ActionComponent,
		TranslateModule,
		RouterLink
	]
})
export class RowActionButtonComponent {

	@Input()
	public id!: string;

	@Input({required: true})
	public item!: IService;

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete(id: string): void {
		this.store.dispatch(new ServiceActions.DeleteItem(id));
		this.clearTableCache();
	}

	public async archive(id: string): Promise<void> {
		await firstValueFrom(this.store.dispatch(
			new ServiceActions.ArchiveItem(id)));
		this.clearTableCache();
	}

	public clearTableCache(): void {
		this.store.dispatch(new ServiceActions.ClearTableCacheAndGetList());
	}

}