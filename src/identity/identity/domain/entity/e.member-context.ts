import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IMemberContext} from "@identity/identity/domain/interface/i.member-context";


export class EMemberContext extends ABaseEntity<'MemberContextDto', IMemberContext.DTO> implements IMemberContext.EntityRaw {
	account!: { _id: string; };
	client!: { _id: string; name: string; };

	public override toDTO(): IMemberContext.DTO {
		return EMemberContext.toDTO(this);
	}

	public static toDTO(data: IMemberContext.EntityRaw): IMemberContext.DTO {
		return {
			stateHistory: data.stateHistory,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			_version: data._version,
			object: data.object,
			state: data.state,
			_id: data._id,

			client: data.client,
			account: data.account,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IMemberContext.DTO): IMemberContext.EntityRaw {
		return new EMemberContext(data);
	}

}

export default EMemberContext;
