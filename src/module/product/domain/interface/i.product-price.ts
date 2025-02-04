import { CurrencyCodeEnum } from '@utility/domain/enum';

export interface IProductPrice {
	value: number;
	currency: CurrencyCodeEnum;
}
