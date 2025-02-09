import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {firstValueFrom} from "rxjs";
import {Store} from "@ngxs/store";
import {ServiceActions} from "@service/state/service/service.actions";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {IService} from "@service/domain/interface/i.service";
import {StateEnum} from "@utility/domain/enum/state.enum";


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
			[hide]="hide()"
			[id]="id()"
			[state]="item().state">
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
	]
})
export class RowActionButtonComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly id = input.required<string>();

	public readonly item = input.required<IService.DTO>();

	private readonly translateService = inject(TranslateService);
	private readonly store = inject(Store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	@Dispatch()
	public delete() {

		const question = this.translateService.instant('service.action.delete.question');

		if (!confirm(question)) {

			throw new Error('User canceled the action');
		}
		return new ServiceActions.DeleteItem(this.item()._id);
	}

	public activate(): void {
		this.store.dispatch(new ServiceActions.UnarchiveItem(this.item()._id));
	}

	public deactivate(): void {
		this.store.dispatch(new ServiceActions.ArchiveItem(this.item()._id));
	}

	public open(): void {
		this.store.dispatch(new ServiceActions.OpenDetails(this.item()));
	}

	public edit(): void {
		this.store.dispatch(new ServiceActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: this.item()
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
