import {Component, input, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardListComponent} from "@order/presentation/component/list/card/card.list.component";
import {FilterComponent} from "@order/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {OrderActions} from "@order/state/order/order.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

@Component({
	selector: 'app-order-mobile-layout-list-component',
	templateUrl: './mobile.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		CardListComponent,
		NgIf,
		NotFoundTableDataComponent,
		TranslateModule,
		FilterComponent,
		AutoRefreshButtonComponent,
		NgClass,
	]
})
export class MobileLayoutListComponent extends LayoutListComponent<IOrderDto> {

	public readonly showButtonGoToForm = input(true);

	@ViewChildren(CardListComponent)
	public cardListComponents!: QueryList<CardListComponent>;

	public openForm(): void {
		this.store.dispatch(new OrderActions.OpenForm());
	}

}
