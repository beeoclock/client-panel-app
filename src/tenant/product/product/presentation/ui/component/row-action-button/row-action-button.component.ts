import {Component, inject, input, ViewEncapsulation} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActionComponent} from "@shared/presentation/component/table/column/action.component";
import {IProduct} from "@tenant/product/product/domain";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	ProductPresentationActions
} from "@tenant/product/product/infrastructure/state/presentation/product.presentation.actions";
import {StateEnum} from "@core/shared/enum/state.enum";
import EProduct from '@src/tenant/product/product/domain/entity/e.product';
import {ProductDataActions} from "@tenant/product/product/infrastructure/state/data/product.data.actions";

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

	private readonly translateService = inject(TranslateService);

	public delete() {

		const question = this.translateService.instant('product.action.delete.question');

		if (!confirm(question)) {
			throw new Error('User canceled the action');
		}

		this.setState(StateEnum.deleted);
	}

	public deactivate() {
		this.setState(StateEnum.inactive);
	}

	public archive() {
		this.setState(StateEnum.archived);
	}

	public activate() {
		this.setState(StateEnum.active);
	}

	@Dispatch()
	public setState(state: StateEnum) {
		const entity = EProduct.fromDTO(this.item());
		return new ProductDataActions.SetState(entity, state);
	}

	@Dispatch()
	public open() {
		const entity = EProduct.fromDTO(this.item());
		return new ProductPresentationActions.OpenDetails(entity);
	}

	@Dispatch()
	public edit() {
		const entity = EProduct.fromDTO(this.item());
		return new ProductPresentationActions.OpenForm({
			componentInputs: {
				isEditMode: true,
				item: entity,
			}
		});
	}
}
