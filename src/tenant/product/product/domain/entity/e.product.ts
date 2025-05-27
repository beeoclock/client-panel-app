import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IProduct, IProductLanguageVersion, IProductPrice} from "@tenant/product/product/domain";
import {IMedia} from "@tenant/media/domain/interface/i.media";
import {ActiveEnum} from "@core/shared/enum";


export class EProduct extends ABaseEntity<'ProductDto', IProduct.DTO, IProduct.EntityRaw> implements IProduct.EntityRaw {

	override object = 'ProductDto' as const;

	sku!: string;
	languageVersions!: IProductLanguageVersion[];
	price!: IProductPrice;
	active!: ActiveEnum;
	tags!: string[];
	order!: number;
	images!: IMedia[];

	public override toDTO(): IProduct.DTO {
		return EProduct.toDTO(this);
	}

	public static toDTO(data: IProduct.EntityRaw): IProduct.DTO {
		return {
			stateHistory: data.stateHistory,
			updatedAt: data.updatedAt,
			createdAt: data.createdAt,
			_version: data._version,
			object: data.object,
			state: data.state,
			_id: data._id,

			sku: data.sku,
			tags: data.tags,
			order: data.order,
			price: data.price,
			images: data.images,
			languageVersions: data.languageVersions,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IProduct.DTO): EProduct {
		return new EProduct(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IProduct.EntityRaw): EProduct {
		return new EProduct(data);
	}

}

export default EProduct;
