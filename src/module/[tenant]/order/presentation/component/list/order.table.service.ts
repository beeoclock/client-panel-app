import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderActions} from "@order/state/order/order.actions";

@Injectable()
export class OrderTableService extends TableService<IOrderDto> {
	public override readonly actions = OrderActions;
}
