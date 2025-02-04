import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";

export interface IPrice {
  price?: number | undefined;
  currency?: CurrencyCodeEnum;
  preferredLanguages?: LanguageCodeEnum[];
}

export type RIPrice = Required<IPrice>;
