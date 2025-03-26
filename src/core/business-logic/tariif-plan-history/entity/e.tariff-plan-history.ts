import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan-history";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {Types} from "@core/shared/types";

export class ETariffPlanHistory extends ABaseEntity<'TariffPlanDto', ITariffPlanHistory.DTO, ITariffPlanHistory.EntityRaw> implements ITariffPlanHistory.EntityRaw {

	startDate!: string & Types.DateTime;
	status! : ITariffPlanHistory.StatusEnum;
	expiredAt?: (string & Types.DateTime) | undefined;
	startedAt!: string & Types.DateTime;
	tariffPlan!: ITariffPlan.DTO;

	override object = 'TariffPlanDto' as const;

	public override toDTO(): ITariffPlanHistory.DTO {
		return ETariffPlanHistory.toDTO(this);
	}

	public static toDTO(data: ITariffPlanHistory.EntityRaw): ITariffPlanHistory.DTO {
		return {
			object: data.object,
			_id: data._id,

			startedAt: data.startedAt,
			status: data.status,
			expiredAt: data.expiredAt,
			tariffPlan: data.tariffPlan,

			state: data.state,
			stateHistory: data.stateHistory,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		};
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: ITariffPlanHistory.DTO): ETariffPlanHistory {
		return new ETariffPlanHistory(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: ITariffPlanHistory.EntityRaw): ETariffPlanHistory {
		return new ETariffPlanHistory(data);
	}


}

export default ETariffPlanHistory;
