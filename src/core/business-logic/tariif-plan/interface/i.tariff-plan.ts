import {IBaseDTO, IBaseEntityRaw} from "@utility/domain";
import {Tools} from "@core/shared/tools";
import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";
import {RegionCodeEnum} from "@core/shared/enum/region-code.enum";
import {TypeTariffPlanEnum} from "@core/shared/enum/type.tariff-plan.enum";
import {BillingCycleEnum} from "@core/shared/enum/billing-cycle.enum";


export namespace ITariffPlan {

	export interface ILanguageVersion {
		object: "LanguageVersionDto";
		title: string;
		description: string;
		language: LanguageCodeEnum;
	}

	export interface IPrice {
		country: CountryCodeEnum;
		region: RegionCodeEnum;
		value: number;
		currency: CurrencyCodeEnum;
		languageVersions: ILanguageVersion[]
	}

	export interface IPluginAttachment {
		includeAll: boolean;
		excludeAll: boolean;
		includeList: string[];
		excludeList: string[];
	}

	export interface DTO extends IBaseDTO<'TariffPlanDto'> {
		type: TypeTariffPlanEnum;
		prices: IPrice[];
		isPerSpecialist: boolean;
		billingCycle: BillingCycleEnum;
		specialistLimit: number;
		features: string[];
		active: ActiveEnum;
		pluginAttachment: IPluginAttachment;
	}

	export type EntityRaw = IBaseEntityRaw<'TariffPlanDto'> & DTO & {};

}


export const isTariffPlan = Tools.createIs<ITariffPlan.DTO>();
export const validTariffPlan = Tools.createValidate<ITariffPlan.DTO>();
export const randomTariffPlan = Tools.createRandom<ITariffPlan.DTO>();
