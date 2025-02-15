import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";

@Injectable()
export class OrderTableService extends TableService<IOrderDto> {
	public override readonly actions = OrderActions;
}
