import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {ITariffPlanHistory} from "@tenant/tariff-plan/tariff-plan-history/domain/interface/i.tariff-plan-history";
import {
	GetTenantTariffPlanPagedApi
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/data-source/api/get/get.tenant-tariff-plan.paged.api";

@Injectable()
export class ApiDataProvider extends DataProvider<ITariffPlanHistory.DTO> {

	private readonly getApi = inject(GetTenantTariffPlanPagedApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams = {}) {
		return this.getApi.execute$(options);
	}

}
