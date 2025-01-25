import {Enum, IBaseEntity} from "@src/module/utility/domain";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {Tools} from "@utility/tools";
import {Types} from "@utility/types";

/**
 * Declare interface by business logic, if you need case when each property is optional, use Partial<ICustomer>
 */
export interface ICustomer extends IBaseEntity<'CustomerDto'> {
	firstName: string & Types.MaxLength<50> | null;
	lastName: string & Types.MaxLength<50> | null;
	phone: string | "" | null;
	email: string & Types.Email | null;
	note: string | null;
	customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;

	active: Enum.ActiveEnum;
}

export const isCustomer = Tools.createIs<ICustomer>();
export const validCustomer = Tools.createValidate<ICustomer>();
export const randomCustomer = Tools.createRandom<ICustomer>();
