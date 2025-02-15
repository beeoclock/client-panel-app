import {ABaseItem} from "../../../system/abstract/a.base-item";
import {IMember} from "../interface/i.member";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {MemberProfileStatusEnum} from "../enums/member-profile-status.enum";
import {IAssignments} from "../interface";
import {RESPONSE_IMemberMedia} from "../interface/i.member-media";


export class EMember extends ABaseItem<'MemberDto', IMember.DTO> implements IMember.Entity {

	firstName!: string;
	lastName!: string;
	email!: string;
	profileStatus!: MemberProfileStatusEnum;
	avatar!: RESPONSE_IMemberMedia;
	role!: RoleEnum;
	phone!: string;
	assignments!: IAssignments;


	public override toDTO(): IMember.DTO {
		return EMember.toDTO(this);
	}

	public static toDTO(data: IMember.Entity): IMember.DTO {
		const {id, ...rest} = data;
		return rest;
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IMember.DTO): IMember.Entity {
		return new EMember(data);
	}

}

export default EMember;
