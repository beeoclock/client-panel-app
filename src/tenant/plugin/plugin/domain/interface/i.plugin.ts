import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {IMedia} from "@tenant/media/domain/interface/i.media";

export enum PluginPriceTypeEnum {
	payAsYouGo = 'payAsYouGo',
	tariffPlan = 'tariffPlan',
}

export namespace IPlugin {

	export interface DTO extends IBaseDTO<'PluginDto'> {
		slug: string;
		languageVersions: {
			object: 'LanguageVersionDto';
			title: string;
			description: string;
			language: string;
		}[];
		version: string;
		isUpcoming: boolean;
		status: {
			isEnabled: boolean;
			isDeprecated: boolean;
		};
		price: {
			isFree: boolean;
			priceType: PluginPriceTypeEnum;
			amount: number;
			currency: string;
		};
		setup: {
			requiresApiKey: boolean;
			setupSteps: string[];
			setupTimeEstimate: string;
			configurationUrl: string;
		};
		providerInfo: {
			name: string;
			version: string;
			documentationUrl: string;
			supportUrl: string;
			contactEmail: string;
		};
		features: string[];
		limits: {
			tariffPlanLimits: {
				tariffPlanType: string;
				dailyLimit: number;
				weeklyLimit: number;
				monthlyLimit: number;
			}[];
		};
		connectionInfo: {
			isConnectable: true
		};
		logo: IMedia;
	}

	export type EntityRaw = IBaseEntityRaw<'PluginDto'> & DTO &
		{

			// TODO: add key in base entity to know if entity synced and when it was synced

			// TODO: getOrders
			// TODO: getFavoriteSpecialist
			// TODO: getFavoriteService
			// TODO: getFavoriteProduct
			// TODO: getSpecialistData - when customer is also as specialist

		};

}

export const isPlugin = Tools.createIs<IPlugin.DTO>();
export const validPlugin = Tools.createValidate<IPlugin.DTO>();
export const randomPlugin = Tools.createRandom<IPlugin.DTO>();
