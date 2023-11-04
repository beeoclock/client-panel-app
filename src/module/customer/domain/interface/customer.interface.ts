import {Enum, RIBaseEntity} from "@src/module/utility/domain";

/**
 * Declare interface by business logic, if you need case when each property is optional, use Partial<ICustomer>
 */
export interface ICustomer extends RIBaseEntity<'Customer'> {
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
	note?: string;

	active: Enum.ActiveEnum;
}

export type RICustomer = Required<ICustomer>;
