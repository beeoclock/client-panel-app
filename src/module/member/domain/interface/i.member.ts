import {IBaseEntity} from "@utility/domain";
import {IAssignments} from "@member/domain";
import IBaseItem from "@src/core/interface/i.base-item";
import {Tools} from "@utility/tools";
import {MemberProfileStatusEnum} from "@member/domain/enums/member-profile-status.enum";
import {RESPONSE_IMemberMedia} from "@member/domain/interface/i.member-media";
import {RoleEnum} from "@utility/domain/enum/role.enum";

export namespace IMember {

	export interface DTO extends IBaseEntity<'MemberDto'> {
		firstName: string;
		lastName: string;
		email: string;
		profileStatus: MemberProfileStatusEnum;
		avatar: RESPONSE_IMemberMedia;
		role: RoleEnum;
		phone: string;
		assignments: IAssignments;
	}

	export interface Entity extends IBaseItem<'MemberDto', DTO>, DTO {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteService
		// TODO: getFavoriteCustomer

	}

}

export const isMember = Tools.createIs<IMember.DTO>();
export const validMember = Tools.createValidate<IMember.DTO>();
export const randomMember = Tools.createRandom<IMember.DTO>();
