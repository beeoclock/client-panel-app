import {Component, Input, ViewEncapsulation} from "@angular/core";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {ActionComponent} from "@utility/presentation/component/table/column/action.component";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {ITableState} from "@utility/domain/table.state";
import {ICustomer} from "@customer/domain";
import {TableComponent} from "@utility/table.component";
import {CustomerActions} from "@customer/state/customer/customer.actions";

@Component({
	selector: 'customer-table-list-component',
	templateUrl: 'table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		ActionComponent,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule
	]
})
export class TableListComponent extends TableComponent {

	public override readonly actions = CustomerActions;

	@Input()
	public tableState!: ITableState<ICustomer>;

}
