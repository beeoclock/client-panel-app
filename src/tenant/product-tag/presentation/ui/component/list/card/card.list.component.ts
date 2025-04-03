import {Component, ViewEncapsulation} from '@angular/core';
import {TableComponent} from "@shared/table.component";
import EProduct from "@tenant/product/domain/entity/e.product";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";

@Component({
	selector: 'product-tag-card-list-component',
	templateUrl: './card.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [],
})
export class CardListComponent extends TableComponent<EProduct> {

	public readonly showAction = new BooleanStreamState(true);

	public showSelectedStatus = new BooleanStreamState(false);

	public override open(item: EProduct): void {
		// this.store.dispatch(new ProductActions.OpenDetails(item));
	}
}
