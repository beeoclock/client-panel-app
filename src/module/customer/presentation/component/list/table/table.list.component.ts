import {Component, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf} from "@angular/common";
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
import {TableComponent} from "@utility/table.component";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ICustomer} from "@customer/domain";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {EventStatusStyleDirective} from "@event/presentation/directive/event-status-style/event-status-style.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";

@Component({
	selector: 'customer-table-list-component',
	templateUrl: './table.list.component.html',
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
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		CurrencyPipe,
		EventStatusStyleDirective,
		HumanizeDurationPipe,
		RowTableFlexDirective,
		TableTableFlexDirective
	]
})
export class TableListComponent extends TableComponent {

	public override readonly actions = CustomerActions;

	@Input()
	public tableState!: ITableState<ICustomer>;

	public readonly tableConfiguration = {
		columns: {
			lastName: {
				style: {
					minWidth: '250px',
				},
			},
			email: {
				style: {
					minWidth: '250px',
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
				style: {
					minWidth: '80px',
				},
			},
		},
	};

}
