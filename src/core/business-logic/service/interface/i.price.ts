import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";

export interface IPrice {
  price?: number | undefined;
  currency?: CurrencyCodeEnum;
  preferredLanguages?: LanguageCodeEnum[];
}

export type RIPrice = Required<IPrice>;
