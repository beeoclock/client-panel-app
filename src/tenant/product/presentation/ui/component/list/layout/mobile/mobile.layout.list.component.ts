import {Component, input, ViewEncapsulation,} from '@angular/core';
import LayoutListComponent from "@shared/layout.list.component";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {ProductActions} from "@tenant/product/infrastructure/state/product/product.actions";
import {NgClass} from "@angular/common";
import {FilterComponent} from "@tenant/product/presentation/ui/component/filter/filter.component";
import {CardListComponent} from "@tenant/product/presentation/ui/component/list/card/card.list.component";

@Component({
	selector: 'product-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgClass,
		FilterComponent,
		CardListComponent
	]
})
export class MobileLayoutListComponent extends LayoutListComponent {
	public readonly showButtonGoToForm = input(true);

	@Dispatch()
	public openForm() {
		return new ProductActions.OpenForm();
	}
}
