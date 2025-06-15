import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IProductTag} from "@tenant/product/product-tag/domain";


export class EProductTag extends ABaseEntity<'ProductTagDto', IProductTag.DTO, IProductTag.EntityRaw> implements IProductTag.EntityRaw {

	public override object = 'ProductTagDto' as const;

	name!: string;

	public override toDTO(): IProductTag.DTO {
		return EProductTag.toDTO(this);
	}

	public static toDTO(data: IProductTag.EntityRaw): IProductTag.DTO {
		return {
			stateHistory: data.stateHistory,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			_version: data._version,
			object: data.object,
			state: data.state,
			_id: data._id,

			name: data.name,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IProductTag.DTO): EProductTag {
		return new EProductTag(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IProductTag.EntityRaw): EProductTag {
		return new EProductTag(data);
	}

}

export default EProductTag;
