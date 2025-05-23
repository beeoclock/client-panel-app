import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IMember} from "../interface/i.member";
import {RoleEnum} from "@core/shared/enum/role.enum";
import {MemberProfileStatusEnum} from "../enums/member-profile-status.enum";
import {RESPONSE_IMemberMedia} from "../interface/i.member-media";
import {IService} from "@tenant/service/domain/interface/i.service";

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

	public changeStatus(status: MemberProfileStatusEnum): void {
		this.profileStatus = status;
		this.refreshUpdatedAt();
	}

	public override toDTO(): IMember.DTO {
		return EMember.toDTO(this);
	}

	public static toDTO(data: IMember.EntityRaw): IMember.DTO {
		return {
			profileStatus: data.profileStatus,
			assignments: data.assignments,
			firstName: data.firstName,
			lastName: data.lastName,
			avatar: data.avatar,
			email: data.email,
			phone: data.phone,
			role: data.role,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			stateHistory: data.stateHistory,
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
