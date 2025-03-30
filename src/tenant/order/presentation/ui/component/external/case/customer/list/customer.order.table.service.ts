import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {PeerCustomerOrderActions} from "@tenant/order/presentation/state/peer-customer/peer-customer.order.actions";

@Injectable()
export class CustomerOrderTableService extends TableService<IOrder.DTO> {
	public override readonly actions = PeerCustomerOrderActions;
}
