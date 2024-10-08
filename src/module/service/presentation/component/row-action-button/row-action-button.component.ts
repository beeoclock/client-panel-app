import {Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router, RouterLink} from "@angular/router";
import {IServiceDto} from "@order/external/interface/i.service.dto";


@Component({
	selector: 'service-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(activate)="activate()"
			(deactivate)="deactivate()"
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			[id]="id"
			[active]="item.active">
			<!--			<li>-->
			<!--				<a-->
			<!--					[routerLink]="['../../', 'event', 'form']"-->
			<!--					[queryParams]="{serviceId: item._id, returnUrl}"-->
			<!--					class="flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
			<!--					<i class="bi bi-calendar2-week"></i>-->
			<!--					{{ 'keyword.capitalize.add-event' | translate }}-->
			<!--				</a>-->
			<!--			</li>-->
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
	public item!: IServiceDto;

	private readonly translateService = inject(TranslateService);
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete(): void {
		const {active} = this.item;

		if (active) {

			return alert('You can\'t delete active service');

		}
		this.store.dispatch(new ServiceActions.DeleteItem(this.item._id));
	}

	public activate(): void {
		this.store.dispatch(new ServiceActions.UnarchiveItem(this.item._id));
	}

	public deactivate(): void {
		this.store.dispatch(new ServiceActions.ArchiveItem(this.item._id));
	}

	public open(): void {
		this.store.dispatch(new ServiceActions.OpenDetails(this.item));
	}

	public edit(): void {
		this.store.dispatch(new ServiceActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: this.item
			},
			pushBoxInputs: {
				title: this.translateService.instant('service.form.title.edit')
			}
		}));
	}

	public async archive(id: string): Promise<void> {
		await firstValueFrom(this.store.dispatch(
			new ServiceActions.ArchiveItem(id)));
	}

}
