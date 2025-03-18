import {Component, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import LayoutListComponent from "@utility/layout.list.component";
import {TableListComponent} from "@order/presentation/component/list/table/table.list.component";
import {
	AutoRefreshButtonComponent
} from "@order/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import EOrder from "@core/business-logic/order/entity/e.order";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

@Component({
	selector: 'app-order-desktop-layout-list-component',
	templateUrl: './desktop.layout.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NotFoundTableDataComponent,
		TableListComponent,
		TranslateModule,
		AutoRefreshButtonComponent,
	]
})
export class DesktopLayoutListComponent extends LayoutListComponent<EOrder> {

	@Dispatch()
	public openForm() {
		return new OrderActions.OpenForm();
	}

}
