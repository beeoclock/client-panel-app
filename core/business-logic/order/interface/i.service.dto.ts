import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {DurationVersionTypeEnum} from "../../service/enum/duration-version-type.enum";
import {IPresentation} from "../../service";
import {IBaseEntity} from "@utility/domain";

export interface IServiceDto extends IBaseEntity<'ServiceDto'> {
	configuration: {
		// object: string; // TODO: Add type
		duration: {
			// object: string; // TODO: Add type
			durationVersionType: DurationVersionTypeEnum;
		}
	},
	presentation: IPresentation;
	prepaymentPolicy: {
		isRequired: boolean;
		isPercentage: boolean;
		value: string;
		minimalCancelTime: string;
	};
	languageVersions: {
		title: string;
		description: string;
		language: LanguageCodeEnum;
		active: ActiveEnum;
	}[];
	durationVersions: {
		breakInSeconds: number;
		durationInSeconds: number;
		prices: {
			price: number;
			currency: CurrencyCodeEnum;
			preferredLanguages: LanguageCodeEnum[];
		}[];
	}[];
	order: number;
}
