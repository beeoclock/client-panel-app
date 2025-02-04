import { ActiveEnum, LanguageCodeEnum } from "@src/module/utility/domain/enum";

export interface IProductLanguageVersion {
	title: string;
	language: LanguageCodeEnum;
	active: ActiveEnum;
	description: string;
}