import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";

export interface IPrice {
  price?: number;
  currency?: CurrencyCodeEnum;
  preferredLanguages?: LanguageCodeEnum[];
}
