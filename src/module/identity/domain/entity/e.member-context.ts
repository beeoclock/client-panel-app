import {ABaseItem} from "@src/core/abstract/a.base-item";
import {IMemberContext} from "@identity/domain/interface/i.member-context";


export class EMemberContext extends ABaseItem<'MemberContextDto', IMemberContext.DTO> implements IMemberContext.Entity {
	account!: { _id: string; };
	client!: { _id: string; name: string; };

	public override toDTO(): IMemberContext.DTO {
		return EMemberContext.toDTO(this);
	}

	public static toDTO(data: IMemberContext.Entity): IMemberContext.DTO {
		const {id, ...rest} = data;
		return rest;
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IMemberContext.DTO): IMemberContext.Entity {
		return new EMemberContext(data);
	}

}

export default EMemberContext;
