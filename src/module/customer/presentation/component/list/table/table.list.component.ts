import {Component, ViewEncapsulation} from "@angular/core";
import {ActiveStyleDirective} from "@utility/presentation/directives/active-style/active-style.directive";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ICustomer} from "@customer/domain";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@customer/presentation/component/row-action-button/row-action-button.component";

@Component({
	selector: 'customer-table-list-component',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		RowActionButtonComponent
	]
})
export class TableListComponent extends TableComponent<ICustomer.Entity> {

	public readonly tableConfiguration = {
		columns: {
			email: {
				style: {
					minWidth: '250px',
					flexGrow: 1,
				},
			},
			lastName: {
				style: {
					minWidth: '150px',
				},
			},
			firstName: {
				style: {
					minWidth: '120px',
				},
			},
			phone: {
				style: {
					minWidth: '200px',
				},
			},
			state: {
				style: {
					minWidth: '120px',
				},
			},
			note: {
				style: {
					minWidth: '260px',
					maxWidth: '260px',
				},
			},
			createdAt: {
				style: {
					minWidth: '200px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '200px',
				},
			},
			action: {
				classList: ['bg-white', 'justify-center'],
				style: {
					minWidth: '75px',
				},
			},
		},
	};

	public override open(item: ICustomer.Entity) {
		this.store.dispatch(new CustomerActions.OpenDetails(item));
	}

}
