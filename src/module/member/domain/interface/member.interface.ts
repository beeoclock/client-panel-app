import {RIBaseEntity} from "@utility/domain";
import {RoleEnum} from "@utility/domain/enum/role.enum";
import {RESPONSE_IMemberMedia} from "@member/domain/interface/i.member-media";
import {ActiveEnum} from "@src/module/utility/domain/enum";

export interface IAssignments {
	// object: 'Assignments';
	service: {
		// "object": "string",
		full: boolean;
		include: {
			// "object": "string",
			serviceId: string;
		}[];
	}
}

export interface IMember extends RIBaseEntity<'Member'> {
	firstName?: string;
	secondName?: string; // Deprecated
	lastName?: string;
	email: string;
	active: ActiveEnum;
	avatar?: RESPONSE_IMemberMedia;
	role?: RoleEnum;
	phone?: string;
	assignments: IAssignments;
}

export type RIMember = Required<IMember>
export type ListMember = RIMember[];
export type PIMember = Partial<RIMember>;
