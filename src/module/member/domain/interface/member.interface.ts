import {RIBaseEntity} from "@utility/domain";
import {RoleEnum} from "@utility/domain/enum/role.enum";
import {RESPONSE_IMemberMedia} from "@member/domain/interface/i.member-media";
import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import {IServiceDto} from "@order/external/interface/i.service.dto";

export interface IAssignments {
	// object: 'Assignments';
	service: {
		// "object": "string",
		full: boolean;
		include: {
			// "object": "string",
			service: IServiceDto;
		}[];
	}
}

export interface IMember extends RIBaseEntity<'Member'> {
	firstName?: string;
	secondName?: string; // Deprecated
	lastName?: string;
	email: string;
	profileStatus: MemberProfileStatusEnum;
	avatar?: RESPONSE_IMemberMedia;
	role?: RoleEnum;
	phone?: string;
	assignments: IAssignments;
}

export type RIMember = Required<IMember>
export type ListMember = RIMember[];
export type PIMember = Partial<RIMember>;
