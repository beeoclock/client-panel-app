import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {Tools} from "@core/shared/tools";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {CountryCodeEnum} from "@core/shared/enum/country-code.enum";
import {RegionCodeEnum} from "@core/shared/enum/region-code.enum";
import {TypeTariffPlanEnum} from "@core/shared/enum/type.tariff-plan.enum";
import {Types} from "@core/shared/types";
import {BillingCycleEnum} from "@core/shared/enum/billing-cycle.enum";

export namespace ITariffPlan {

	export interface ILanguageVersion {
		title: string;
		description: string;
		language: LanguageCodeEnum;
	}

	export interface IValue {
		billingCycle: BillingCycleEnum;
		beforeDiscount: number;
		afterDiscount: number;
		discountPercentage: number;
	}

	export interface IPrice {
		values: IValue[];
		country?: CountryCodeEnum;
		region: RegionCodeEnum;
		currency: CurrencyCodeEnum;
		languageVersions: ILanguageVersion[];
		createdAt: string & Types.DateTime;
		updatedAt: string & Types.DateTime;
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
		specialistLimit: number | null;
		features: string[];
		pluginAttachment: IPluginAttachment;
	}

	export type EntityRaw = IBaseEntityRaw<'TariffPlanDto'> & DTO & {};


}

export const isTariffPlan = Tools.createIs<ITariffPlan.DTO>();
export const validTariffPlan = Tools.createValidate<ITariffPlan.DTO>();
export const randomTariffPlan = Tools.createRandom<ITariffPlan.DTO>();
