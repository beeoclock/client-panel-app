import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IMember} from "../interface/i.member";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {MemberProfileStatusEnum} from "../enums/member-profile-status.enum";
import {IAssignments} from "../interface";
import {RESPONSE_IMemberMedia} from "../interface/i.member-media";

export class EMember extends ABaseEntity<'MemberDto', IMember.DTO> implements IMember.Entity {

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
		return {
			_id: data._id,
			assignments: data.assignments,
			avatar: data.avatar,
			createdAt: data.createdAt,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			object: data.object,
			phone: data.phone,
			profileStatus: data.profileStatus,
			role: data.role,
			state: data.state,
			stateHistory: data.stateHistory,
			updatedAt: data.updatedAt,
		}
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
