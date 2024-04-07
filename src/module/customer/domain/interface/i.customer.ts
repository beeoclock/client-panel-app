import {Enum, IBaseEntity} from "@src/module/utility/domain";
import typia, {tags} from "typia";

/**
 * Declare interface by business logic, if you need case when each property is optional, use Partial<ICustomer>
 */
export interface ICustomer extends IBaseEntity<'Customer'> {
	firstName: string & tags.MinLength<1> & tags.MaxLength<50> | null;
	lastName: string & tags.MinLength<1> & tags.MaxLength<50> | null;
	phone: string | null;
	email: string & tags.Format<"email"> | null;
	note: string | null;

	active: Enum.ActiveEnum;
}

export const isCustomer = typia.createIs<ICustomer>();
export const validCustomer = typia.createValidate<ICustomer>();
