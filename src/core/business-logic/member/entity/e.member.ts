import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IMember} from "../interface/i.member";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {MemberProfileStatusEnum} from "../enums/member-profile-status.enum";
import {RESPONSE_IMemberMedia} from "../interface/i.member-media";
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

export class EMember extends ABaseEntity<'MemberDto', IMember.DTO, IMember.EntityRaw> implements IMember.EntityRaw {

	override object = 'MemberDto' as const;

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

	public static toDTO(data: IMember.EntityRaw): IMember.DTO {
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
	public static fromDTO(data: IMember.DTO): EMember {
		return new EMember(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IMember.EntityRaw): EMember {
		return new EMember(data);
	}

}

export default EMember;
