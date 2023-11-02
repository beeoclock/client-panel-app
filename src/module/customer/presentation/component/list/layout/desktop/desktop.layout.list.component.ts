import {Component, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {ICustomer} from "@customer/domain";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import {LayoutListComponent} from "@utility/layout.list.component";
import {
	AutoRefreshButtonComponent
} from "@customer/presentation/component/button/auto-refresh/auto-refresh.button.component";

@Component({
	selector: 'customer-desktop-layout-list-component',
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
export class DesktopLayoutListComponent extends LayoutListComponent<ICustomer> {

}
