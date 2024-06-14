import {Enum, IBaseEntity} from "@src/module/utility/domain";
import typia, {tags} from "typia";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";

/**
 * Declare interface by business logic, if you need case when each property is optional, use Partial<ICustomer>
 */
export interface ICustomer extends IBaseEntity<'CustomerDto'> {
	firstName: string & tags.MaxLength<50> | null;
	lastName: string & tags.MaxLength<50> | null;
	phone: string | null;
	email: string & tags.Format<"email"> | null;
	note: string | null;
	customerType: CustomerTypeEnum & tags.Default<CustomerTypeEnum.new>;

	active: Enum.ActiveEnum;
}

export const isCustomer = typia.createIs<ICustomer>();
export const validCustomer = typia.createValidate<ICustomer>();
export const randomCustomer = typia.createRandom<ICustomer>();
