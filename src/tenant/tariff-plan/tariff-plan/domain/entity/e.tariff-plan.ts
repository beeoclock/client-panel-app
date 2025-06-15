import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";
import {TypeTariffPlanEnum} from "@core/shared/enum/type.tariff-plan.enum";

export class ETariffPlan extends ABaseEntity<'TariffPlanDto', ITariffPlan.DTO, ITariffPlan.EntityRaw> implements ITariffPlan.EntityRaw {

	override object = 'TariffPlanDto' as const;

	type!: TypeTariffPlanEnum;
	prices!: ITariffPlan.IPrice[];
	isPerSpecialist!: boolean;
	specialistLimit!: number | null;
	features!: string[];
	pluginAttachment!: ITariffPlan.IPluginAttachment;

	public override toDTO(): ITariffPlan.DTO {
		return ETariffPlan.toDTO(this);
	}

	public static toDTO(data: ITariffPlan.EntityRaw): ITariffPlan.DTO {
		return {
			isPerSpecialist: data.isPerSpecialist,
			pluginAttachment: data.pluginAttachment,
			specialistLimit: data.specialistLimit,
			features: data.features,
			prices: data.prices,
			state: data.state,
			type: data.type,

			_id: data._id,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,
		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: ITariffPlan.DTO): ETariffPlan {
		return new ETariffPlan(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: ITariffPlan.EntityRaw): ETariffPlan {
		return new ETariffPlan(data);
	}

}

export default ETariffPlan;
