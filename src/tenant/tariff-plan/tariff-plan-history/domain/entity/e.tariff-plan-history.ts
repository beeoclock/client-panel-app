import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {ITariffPlanHistory} from "@tenant/tariff-plan/tariff-plan-history/domain/interface/i.tariff-plan-history";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";
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
			tariffPlan: data.tariffPlan,
			startedAt: data.startedAt,
			expiredAt: data.expiredAt,
			status: data.status,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
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
