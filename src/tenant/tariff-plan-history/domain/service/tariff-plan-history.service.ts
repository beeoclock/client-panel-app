import {BaseService} from "@core/shared/service/base.service";
import {ITariffPlanHistory} from "@tenant/tariff-plan-history/domain/interface/i.tariff-plan-history";
import ETariffPlanHistory from "@tenant/tariff-plan-history/domain/entity/e.tariff-plan-history";

type ENTITY_RAW = ITariffPlanHistory.EntityRaw;

export class TariffPlanHistoryService extends BaseService<ENTITY_RAW> {

	public async getActualTariffPlanEntity(): Promise<ETariffPlanHistory | null> {
		const {0: actualTariffPlan = null} = await this.db.where('status').equals('active').toArray();
		if (!actualTariffPlan) {
			return actualTariffPlan;
		}
		const actualTariffPlanEntity = ETariffPlanHistory.fromRaw(actualTariffPlan);
		return actualTariffPlanEntity;
	}

	public async getTrialTariffPlanEntity(): Promise<ETariffPlanHistory | null> {
		const {0: trialTariffPlan = null} = await this.db.where('status').equals('trial').toArray();
		if (!trialTariffPlan) {
			return trialTariffPlan;
		}
		const trialTariffPlanEntity = ETariffPlanHistory.fromRaw(trialTariffPlan);
		return trialTariffPlanEntity;
	}

}
