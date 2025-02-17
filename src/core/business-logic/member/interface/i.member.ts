import {IBaseDTO, IBaseEntity} from "@utility/domain";
import {IAssignments} from "../index";
import {Tools} from "@core/shared/tools";
import {MemberProfileStatusEnum} from "../enums/member-profile-status.enum";
import {RESPONSE_IMemberMedia} from "./i.member-media";
import {RoleEnum} from "@core/shared/enum/role.enum";

export namespace IMember {

	export interface DTO extends IBaseDTO<'MemberDto'> {
		firstName: string;
		lastName: string;
		email: string;
		profileStatus: MemberProfileStatusEnum;
		avatar: RESPONSE_IMemberMedia;
		role: RoleEnum;
		phone: string;
		assignments: IAssignments;
	}

	export type Entity = IBaseEntity<'MemberDto', DTO> & DTO & {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteService
		// TODO: getFavoriteCustomer

	};

}

export const isMember = Tools.createIs<IMember.DTO>();
export const validMember = Tools.createValidate<IMember.DTO>();
export const randomMember = Tools.createRandom<IMember.DTO>();
