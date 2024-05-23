import {LanguageCodeEnum} from "@utility/domain/enum";

export interface IServiceDto {
	object: "ServiceDto";
	_id: string;
	active: number;
	configuration: {
		object: string;
		duration: {
			object: string;
			durationVersionType: string;
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
