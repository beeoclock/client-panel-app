import {Injectable} from "@angular/core";
import {BaseService} from "@core/shared/service/base.service";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan";
import ETariffPlanHistory from "@core/business-logic/tariif-plan-history/entity/e.tariff-plan-history";

type ENTITY_RAW = ITariffPlanHistory.EntityRaw;

@Injectable()
export class TariffPlanHistoryService extends BaseService<ENTITY_RAW> {

	public async getActualTariffPlanEntity(): Promise<ETariffPlanHistory> {
		const {0: actualTariffPlan} = await this.db.where('status').equals('active').toArray();
		const actualTariffPlanEntity = ETariffPlanHistory.fromRaw(actualTariffPlan);
		return actualTariffPlanEntity;
	}

}
