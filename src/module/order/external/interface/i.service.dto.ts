import {LanguageCodeEnum} from "@utility/domain/enum";
import {DurationVersionTypeEnum} from "@service/domain/enum/duration-version-type.enum";

export interface IServiceDto {
	object: "ServiceDto";
	_id: string;
	active: number;
	configuration: {
		// object: string; // TODO: Add type
		duration: {
			// object: string; // TODO: Add type
			durationVersionType: DurationVersionTypeEnum;
		}
	},
	presentation: {
		banners: string[];
	};
	prepaymentPolicy: {
		isRequired: boolean;
		isPercentage: boolean;
		value: string;
		minimalCancelTime: string;
	};
	languageVersions: {
		title: string;
		description: string;
		language: string;
		active: number;
	}[];
	durationVersions: [
		{
			breakInSeconds: number;
			durationInSeconds: number;
			prices: {
				price: number;
				currency: string;
				preferredLanguages: LanguageCodeEnum[];
			}[];
		}
	];
	createdAt: string;
	updatedAt: string;
	order: number;
}
