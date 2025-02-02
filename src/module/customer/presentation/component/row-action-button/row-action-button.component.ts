import {Component, inject, input, ViewEncapsulation} from "@angular/core";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {ICustomer} from "@customer/domain";

@Component({
	selector: 'customer-row-action-button-component',
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
			[active]="item().active">
			<!--			<li>-->
			<!--				<a-->
			<!--					[routerLink]="['../../', 'event', 'form']"-->
			<!--					[queryParams]="{customerId: item._id, returnUrl}"-->
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

	public readonly id = input.required<string>();

	public readonly item = input.required<ICustomer.DTO>();

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	private readonly customerStore = inject(ECustomer.store);
	private readonly router = inject(Router);
	public readonly returnUrl = this.router.url;

	public delete(): void {
		const {active} = this.item();

		if (active) {

			return alert('You can\'t delete active customer');

		}
		this.customerStore.deleteItem(this.item()._id);
	}

	public activate(): void {
		this.customerStore.unarchiveItem(this.item()._id);
	}

	public deactivate(): void {
		this.customerStore.archiveItem(this.item()._id);
	}

	public open(): void {
		this.customerStore.openDetailsById(this.item()._id);
	}

	public edit(): void {
		this.customerStore.openForm({
			componentInputs: {
				isEditMode: true,
				item: this.item()
			}
		});
	}

}
