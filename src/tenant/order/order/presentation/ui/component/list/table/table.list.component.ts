import {Component, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {TableComponent} from "@shared/table.component";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {
	RowActionButtonComponent
} from "@tenant/order/order/presentation/ui/component/row-action-button/row-action-button.component";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import EOrder from "@tenant/order/order/domain/entity/e.order";
import {DatePipe} from "@angular/common";

@Component({
	selector: 'app-list-order-table',
	templateUrl: './table.list.component.html',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
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
