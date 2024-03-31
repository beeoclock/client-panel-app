import {RIBaseEntity} from "@utility/domain";
import {RoleEnum} from "@utility/domain/enum/role.enum";
import {RESPONSE_IMemberMedia} from "@member/domain/interface/i.member-media";

export interface IMember extends RIBaseEntity<'Member'> {
	firstName?: string;
	secondName?: string; // Deprecated
	lastName?: string;
	email: string;
	avatar?: RESPONSE_IMemberMedia;
	role?: RoleEnum;
	phone?: string;
}

export type RIMember = Required<IMember>
export type ListMember = RIMember[];
export type PIMember = Partial<RIMember>;
