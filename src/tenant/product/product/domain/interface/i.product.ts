import {Tools} from "@core/shared/tools";
import {IProductLanguageVersion, IProductPrice} from "@tenant/product/product/domain";
import {IMedia} from "@tenant/media/domain/interface/i.media";
import {IBaseDTO, IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";

export namespace IProduct {

	export interface DTO extends IBaseDTO<'ProductDto'> {
		sku: string;
		languageVersions: IProductLanguageVersion[];
		price: IProductPrice;
		tags: string[];
		order: number;
		images: IMedia[];
	}

	export type EntityRaw = IBaseEntityRaw<'ProductDto'> & DTO &
		{

			// TODO: add key in base entity to know if entity synced and when it was synced

			// TODO: getOrders
			// TODO: getFavoriteSpecialist
			// TODO: getFavoriteService
			// TODO: getFavoriteProduct
			// TODO: getSpecialistData - when customer is also as specialist

		};

}

export const isProduct = Tools.createIs<IProduct.DTO>();
export const validProduct = Tools.createValidate<IProduct.DTO>();
export const randomProduct = Tools.createRandom<IProduct.DTO>();
