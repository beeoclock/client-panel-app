import {Component, ViewEncapsulation} from "@angular/core";
import {
	TableStatePaginationComponent
} from "@shared/presentation/component/pagination/table-state-pagination.component";
import {SortIndicatorComponent} from "@shared/presentation/component/pagination/sort.indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {BodyTableFlexDirective} from "@shared/presentation/directives/talbe/flex/body.table.flex.directive";
import {ColumnTableFlexDirective} from "@shared/presentation/directives/talbe/flex/column.table.flex.directive";
import {RowTableFlexDirective} from "@shared/presentation/directives/talbe/flex/row.table.flex.directive";
import {TableTableFlexDirective} from "@shared/presentation/directives/talbe/flex/table.table.flex.directive";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {
	RowActionButtonComponent
} from "@tenant/order/presentation/ui/component/row-action-button/row-action-button.component";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import EOrder from "@tenant/order/domain/entity/e.order";
import {DatePipe} from "@angular/common";

@Component({
	selector: 'app-list-order-table',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TableStatePaginationComponent,
		SortIndicatorComponent,
		TranslateModule,
		BodyTableFlexDirective,
		ColumnTableFlexDirective,
		RowTableFlexDirective,
		TableTableFlexDirective,
		NoDataPipe,
		RowActionButtonComponent,
		DatePipe
	]
})
export class TableListComponent extends TableComponent<EOrder> {

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
					minWidth: '180px',
				},
			},
			updatedAt: {
				style: {
					minWidth: '180px',
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

	public override open(item: IOrder.DTO) {
		this.store.dispatch(new OrderActions.OpenDetails(item));
	}

}
