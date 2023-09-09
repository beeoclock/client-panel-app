import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ListPage} from "@utility/list.page";
import {Select} from "@ngxs/store";
import {CustomerState} from "@customer/state/customer/customer.state";
import {Observable} from "rxjs";
import {ICustomer} from "@customer/domain";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ITableState} from "@utility/domain/table.state";
import {TableListComponent} from "@customer/presentation/component/list/table/table.list.component";
import {StarterComponent} from "@utility/presentation/component/starter/starter.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterComponent} from "@customer/presentation/component/filter/filter.component";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
	selector: 'customer-list-page',
	templateUrl: 'index.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TableListComponent,
		StarterComponent,
		TranslateModule,
		FilterComponent,
		DropdownComponent,
		RouterLink,
		NgIf,
		AsyncPipe
	],
	standalone: true
})
export default class Index extends ListPage {

	public override readonly actions = CustomerActions;

	@Select(CustomerState.tableState)
	public readonly tableState$!: Observable<ITableState<ICustomer>>;

}
