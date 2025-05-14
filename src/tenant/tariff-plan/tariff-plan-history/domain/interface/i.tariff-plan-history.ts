import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";
import {IBaseDTO, IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {Types} from "@core/shared/types";


export namespace ITariffPlanHistory {

	export enum StatusEnum {
		active = 'active',
		inactive = 'inactive',
		trial = 'trial',
	}

	export interface DTO extends IBaseDTO<'TariffPlanDto'> {
		startedAt: string & Types.DateTime;
		status: StatusEnum;
		expiredAt?: string & Types.DateTime;
		trialUntil?: string & Types.DateTime;
		tariffPlan: ITariffPlan.DTO;
	}

	export type EntityRaw = IBaseEntityRaw<'TariffPlanDto'> & DTO & {};

}
