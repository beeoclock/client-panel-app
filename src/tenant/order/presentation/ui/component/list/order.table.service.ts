import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {OrderActions} from "@tenant/order/presentation/state/order/order.actions";
import {IOrder} from "@tenant/order/domain/interface/i.order";

@Injectable()
export class OrderTableService extends TableService<IOrder.EntityRaw> {
	public override readonly actions = OrderActions;
}
