import {Component, ViewEncapsulation} from "@angular/core";
import {
	TableStatePaginationComponent
} from "@utility/presentation/component/pagination/table-state-pagination.component";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {SortIndicatorComponent} from "@utility/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@utility/table.component";
import {BodyTableFlexDirective} from "@utility/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@utility/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@utility/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@utility/presentation/directives/talbe/flex/table.table.flex.directive";
import {NoDataPipe} from "@utility/presentation/pipes/no-data.pipe";
import {RowActionButtonComponent} from "@order/presentation/component/row-action-button/row-action-button.component";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";

@Component({
	selector: 'app-list-order-table',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
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
export class TableListComponent extends TableComponent<IOrderDto> {

	// public override readonly actions = OrderActions;

	public readonly tableConfiguration = {
		columns: {
			services: {
				style: {
					minWidth: '100px',
					flexGrow: 1,
				},
			},
			businessNote: {
				style: {
					minWidth: '150px',
				},
			},
			status: {
				style: {
					minWidth: '100px',
				},
			},
			createdAt: {
				style: {
					minWidth: '200px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '250px',
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

	public override open(item: IOrderDto) {
		this.store.dispatch(new OrderActions.OpenDetails(item));
	}

}
