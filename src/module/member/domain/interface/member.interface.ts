import {RIBaseEntity} from "@utility/domain";
import {RoleEnum} from "@utility/domain/enum/role.enum";

export interface IMember extends RIBaseEntity<'Member'> {
	firstName?: string;
	secondName?: string; // Deprecated
	lastName?: string;
	email: string;
	avatar?: string;
	role?: RoleEnum;
	phone?: string;
}

export type RIMember = Required<IMember>
export type ListMember = RIMember[];
export type PIMember = Partial<RIMember>;
