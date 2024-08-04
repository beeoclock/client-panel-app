import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ICustomer} from "@customer/domain";

@Injectable()
export class CustomerTableService extends TableService<ICustomer> {
	public override readonly actions = CustomerActions;
}
