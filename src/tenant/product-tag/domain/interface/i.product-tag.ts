import {Tools} from "@core/shared/tools";
import {IBaseDTO, IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";

export namespace IProductTag {

	export interface DTO extends IBaseDTO<'TagDto'> {
		name: string;
	}

	export type EntityRaw = IBaseEntityRaw<'TagDto'> & DTO & {};

}

export const isProductTag = Tools.createIs<IProductTag.DTO>();
export const validProductTag = Tools.createValidate<IProductTag.DTO>();
export const randomProductTag = Tools.createRandom<IProductTag.DTO>();
