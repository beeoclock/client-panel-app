import {Component, input, ViewEncapsulation} from "@angular/core";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {ICustomer} from "@customer/domain";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import LayoutListComponent from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@customer/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ITableState} from "@utility/domain/table.state";

@Component({
	selector: 'customer-desktop-layout-list-component',
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
export class DesktopLayoutListComponent extends LayoutListComponent<ICustomer> {
	public override readonly tableState = input.required<ITableState<ICustomer> | null>();
	public openForm(): void {
		this.store.dispatch(new CustomerActions.OpenForm());
	}

}
