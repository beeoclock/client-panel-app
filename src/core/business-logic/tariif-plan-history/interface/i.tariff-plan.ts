import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {IBaseDTO, IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {Types} from "@core/shared/types";


export namespace ITariffPlanHistory {

	export interface DTO extends IBaseDTO<'TariffPlanDto'> {
		startDate: string & Types.DateTime; // TODO: Change into statedAt
		status: 'active'; // TODO: Add other statuses
		expiredAt?: string & Types.DateTime;
		tariffPlan: ITariffPlan.DTO;
	}

	export type EntityRaw = IBaseEntityRaw<'TariffPlanDto'> & DTO & {};

}
