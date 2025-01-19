import { Enum, IBaseEntity } from '@src/module/utility/domain';
import { Tools } from '@utility/tools';
import { IMedia } from '@src/module/media/domain/interface/i.media';
import { IProductPrice } from './i.product-price';
import { IProductLanguageVersion } from './i.product-language-version';

/**
 * Declare interface by business logic, if you need case when each property is optional, use Partial<IProduct>
 */
export interface IProduct extends IBaseEntity<'ProductDTO'> {
	sku: string;
    languageVersions: IProductLanguageVersion[];
    price?: IProductPrice;
    active: Enum.ActiveEnum;
    tags?: string[]
    order?: number;
    images?: IMedia[];
}

export const isProduct = Tools.createIs<IProduct>();
export const validProduct = Tools.createValidate<IProduct>();
export const randomProduct = Tools.createRandom<IProduct>();
