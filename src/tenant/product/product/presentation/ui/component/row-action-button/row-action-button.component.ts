import {Component, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ActionComponent} from "@shared/presentation/component/table/column/action.component";
import {IProduct} from "@tenant/product/product/domain";

@Component({
	selector: 'product-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(activate)="activate()"
			(deactivate)="deactivate()"
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			[id]="id()"
		/>
	`,
	imports: [ActionComponent, TranslateModule, ActionComponent],
})
export class RowActionButtonComponent {
	public readonly id = input.required<string>();

	public readonly item = input.required<IProduct.DTO>();

	public delete(): void {
		// this.#store.dispatch(new ProductActions.DeleteItem(this.item()._id));
	}

	public activate(): void {
		// this.#store.dispatch(new ProductActions.UnarchiveItem(this.item()._id));
	}

	public deactivate(): void {
		// this.#store.dispatch(new ProductActions.ArchiveItem(this.item()._id));
	}

	public open(): void {
		// this.#store.dispatch(new ProductActions.OpenDetails(this.item()));
	}

	public edit(): void {
		// this.#store.dispatch(
		// 	new ProductActions.OpenForm({
		// 		componentInputs: {
		// 			isEditMode: true,
		// 			item: this.item(),
		// 		},
		// 		pushBoxInputs: {
		// 			title: this.#translateService.instant('product.form.title.edit')
		// 		}
		// 	})
		// );
	}
}
