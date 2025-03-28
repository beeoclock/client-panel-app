import {ActiveEnum, LanguageCodeEnum} from "@core/shared/enum";

export interface ILanguageVersion {
  title?: string;
  description?: string;
  language?: LanguageCodeEnum;
  active?: ActiveEnum;
}

export type RILanguageVersion = Required<ILanguageVersion>;
export type ListLanguageVersion = RILanguageVersion[];
