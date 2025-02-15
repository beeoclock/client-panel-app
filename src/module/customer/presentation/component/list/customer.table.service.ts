import {Injectable} from "@angular/core";
import {TableService} from "@utility/table.service";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ICustomer} from "../../../../../../core/business-logic/customer";

@Injectable()
export class CustomerTableService extends TableService<ICustomer.Entity> {
	public override readonly actions = CustomerActions;
}
