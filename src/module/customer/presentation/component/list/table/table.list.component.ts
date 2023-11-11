import {Component, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
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
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
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
		NgForOf,
		RouterLink,
		ActiveStyleDirective,
		TableStatePaginationComponent,
		DynamicDatePipe,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		CurrencyPipe,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		RowActionButtonComponent
	]
})
export class TableListComponent extends TableComponent<ICustomer> {

	public override readonly actions = CustomerActions;

	public readonly tableConfiguration = {
		columns: {
			email: {
				style: {
					minWidth: '350px',
					flexGrow: 1,
				},
			},
			lastName: {
				style: {
					minWidth: '200px',
				},
			},
			firstName: {
				style: {
					minWidth: '200px',
				},
			},
			phone: {
				style: {
					minWidth: '200px',
				},
			},
			active: {
				style: {
					minWidth: '200px',
				},
			},
			note: {
				style: {
					minWidth: '200px',
				},
			},
			createdAt: {
				style: {
					minWidth: '250px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '250px',
				},
			},
			action: {
				classList: ['bg-white'],
				style: {
					minWidth: '66px',
				},
			},
		},
	};

}
