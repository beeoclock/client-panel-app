import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {PeerCustomerOrderActions} from "@order/infrastructure/state/peer-customer/peer-customer.order.actions";

@Injectable()
export class CustomerOrderTableService extends TableService<IOrderDto> {
	public override readonly actions = PeerCustomerOrderActions;
}
