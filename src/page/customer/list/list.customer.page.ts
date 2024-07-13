import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Observable, tap} from "rxjs";
import {ICustomer} from "@customer/domain";
import {ITableState} from "@utility/domain/table.state";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {CardListComponent} from "@customer/presentation/component/list/card/card.list.component";
import {
	DesktopLayoutListComponent
} from "@customer/presentation/component/list/layout/desktop/desktop.layout.list.component";
import {
	MobileLayoutListComponent
} from "@customer/presentation/component/list/layout/mobile/mobile.layout.list.component";
import {TableService} from "@utility/table.service";
import {CustomerTableService} from "@customer/presentation/component/list/customer.table.service";

@Component({
	selector: 'app-list-customer-page',
	templateUrl: './list.customer.page.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		StarterComponent,
		TranslateModule,
		FilterComponent,
		DropdownComponent,
		RouterLink,
		NgIf,
		AsyncPipe,
		PrimaryButtonDirective,
		NotFoundTableDataComponent,
		CardListComponent,
		TableListComponent,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
		DesktopLayoutListComponent,
		MobileLayoutListComponent,
	],
	standalone: true,
	providers: [
		{
			provide: TableService,
			useClass: CustomerTableService
		}
	]
})
export class ListCustomerPage extends ListPage {

	public readonly tableState$: Observable<ITableState<ICustomer>> = this.store.select(CustomerState.tableState)
		.pipe(
			tap((tableState) => {
				this.changeDetectorRef.detectChanges();
			})
		);

}

export default ListCustomerPage;
