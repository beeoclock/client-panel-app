import {Component, input, viewChildren, ViewEncapsulation} from "@angular/core";
import {NgClass} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@order/presentation/component/list/card/card.list.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import EOrder from "@core/business-logic/order/entity/e.order";

@Component({
	selector: 'app-order-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		CardListComponent,
		NotFoundTableDataComponent,
		TranslateModule,
		AutoRefreshButtonComponent,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<EOrder> {

	public readonly showButtonGoToForm = input(true);

	/**
	 * Used external
	 */
	public readonly cardListComponents = viewChildren(CardListComponent);

	public openForm(): void {
		this.store.dispatch(new OrderActions.OpenForm());
	}

}
