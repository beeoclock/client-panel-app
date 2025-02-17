import {IBaseEntity} from "@utility/domain";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {RESPONSE_IMemberMedia} from "./i.member-media";
import {MemberProfileStatusEnum} from "../enums/member-profile-status.enum";
import {IService} from "@core/business-logic/service/interface/i.service";

export interface IAssignments {
	// object: 'Assignments';
	service: {
		// "object": "string",
		full: boolean;
		include: {
			// "object": "string",
			service: IService.DTO;
		}[];
	}
}

export interface IMember extends IBaseEntity<'MemberDto'> {
	firstName?: string;
	lastName?: string;
	email: string;
	profileStatus: MemberProfileStatusEnum;
	avatar?: RESPONSE_IMemberMedia;
	role?: RoleEnum;
	phone?: string;
	assignments: IAssignments;
}

export type RIMember = Required<IMember>;
export type ListMember = RIMember[];
export type PIMember = Partial<RIMember>;
