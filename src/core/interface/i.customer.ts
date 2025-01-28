import {Enum, IBaseEntity} from "@utility/domain";
import {Types} from "@utility/types";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";

export interface ICustomer extends IBaseEntity<'CustomerDto'> {
	firstName: string & Types.MaxLength<50> | null;
	lastName: string & Types.MaxLength<50> | null;
	phone: string | "" | null;
	email: string & Types.Email | null;
	note: string | null;
	customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;

	active: Enum.ActiveEnum;
}
