import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {IOrder} from "@core/business-logic/order/interface/i.order";

@Injectable()
export class OrderTableService extends TableService<IOrder.Entity> {
	public override readonly actions = OrderActions;
}
