import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { ActionComponent } from '@utility/presentation/component/table/column/action.component';
import { Store } from '@ngxs/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IProduct } from '@product/domain';
import { ProductActions } from '@product/state/product/product.actions';

@Component({
	selector: 'product-row-action-button-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: `
		<utility-table-column-action
			(delete)="delete()"
			(open)="open()"
			(edit)="edit()"
			[id]="id()"
		>
		</utility-table-column-action>
	`,
	imports: [ActionComponent, TranslateModule],
})
export class RowActionButtonComponent {
	public readonly id = input.required<string>();

	public readonly item = input.required<IProduct>();

	private readonly store = inject(Store);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	public readonly returnUrl = this.router.url;

	public delete(): void {
		this.store.dispatch(new ProductActions.DeleteItem(this.item()._id));
	}

	public open(): void {
		this.store.dispatch(new ProductActions.OpenDetails(this.item()));
	}

	public edit(): void {
		this.store.dispatch(
			new ProductActions.OpenForm({
				componentInputs: {
					isEditMode: true,
					item: this.item(),
				},
				pushBoxInputs: {
					title: this.translateService.instant('product.form.title.edit')
				}
			})
		);
	}
}
