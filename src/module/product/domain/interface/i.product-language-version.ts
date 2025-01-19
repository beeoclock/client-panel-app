import { LanguageCodeEnum } from "@src/module/utility/domain/enum";

export interface IProductLanguageVersion {
	language: LanguageCodeEnum;
	title: string;
	description?: string;
}

