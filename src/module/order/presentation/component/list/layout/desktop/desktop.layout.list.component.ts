import {Component, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {FilterComponent} from "@order/presentation/component/filter/filter.component";
import {TableListComponent} from "@order/presentation/component/list/table/table.list.component";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {IOrderDto} from "../../../../../../../../core/business-logic/order/interface/details/i.order.dto";

@Component({
	selector: 'app-order-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NotFoundTableDataComponent,
		TableListComponent,
		TranslateModule,
		AutoRefreshButtonComponent,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent<IOrderDto> {

	public openForm(): void {
		this.store.dispatch(new OrderActions.OpenForm());
	}

}
