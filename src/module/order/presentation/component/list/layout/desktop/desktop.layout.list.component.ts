import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
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
import {OrderActions} from "@order/state/order/order.actions";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

@Component({
	selector: 'app-order-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		FilterComponent,
		NgIf,
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
