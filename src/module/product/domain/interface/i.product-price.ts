import { CurrencyCodeEnum } from '@utility/domain/enum';

export interface IProductPrice {
	price: number;
	currency: CurrencyCodeEnum;
}
