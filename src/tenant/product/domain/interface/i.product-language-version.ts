import {ActiveEnum, LanguageCodeEnum} from "@core/shared/enum";

export interface IProductLanguageVersion {
	title: string;
	language: LanguageCodeEnum;
	active: ActiveEnum;
	description: string;
}
