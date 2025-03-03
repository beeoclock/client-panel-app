import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {ActiveEnum} from "@core/shared/enum";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {BillingCycleEnum} from "@core/shared/enum/billing-cycle.enum";
import {TypeTariffPlanEnum} from "../../../shared/enum/type.tariff-plan.enum";

export class ETariffPlan extends ABaseEntity<'TariffPlanDto', ITariffPlan.DTO, ITariffPlan.EntityRaw> implements ITariffPlan.EntityRaw {

	override object = 'TariffPlanDto' as const;

	type!: TypeTariffPlanEnum;
	prices!: ITariffPlan.IPrice[];
	isPerSpecialist!: boolean;
	billingCycle!: BillingCycleEnum;
	specialistLimit!: number;
	features!: string[];
	active!: ActiveEnum;
	pluginAttachment!: ITariffPlan.IPluginAttachment;


	public override toDTO(): ITariffPlan.DTO {
		return ETariffPlan.toDTO(this);
	}

	public static toDTO(data: ITariffPlan.EntityRaw): ITariffPlan.DTO {
		return {
			object: data.object,
			_id: data._id,

			active: data.active,
			billingCycle: data.billingCycle,
			features: data.features,
			isPerSpecialist: data.isPerSpecialist,
			pluginAttachment: data.pluginAttachment,
			specialistLimit: data.specialistLimit,
			prices: data.prices,
			type: data.type,

			state: data.state,
			stateHistory: data.stateHistory,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
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
