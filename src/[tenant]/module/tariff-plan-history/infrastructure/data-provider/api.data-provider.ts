import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {ITariffPlanHistory} from "@core/business-logic/tariif-plan-history/interface/i.tariff-plan";
import {GetTenantTariffPlanPagedApi} from "@tariffPlanHistory/infrastructure/api/get/get.tenant-tariff-plan.paged.api";

@Injectable()
export class ApiDataProvider extends DataProvider<ITariffPlanHistory.DTO> {

	private readonly getApi = inject(GetTenantTariffPlanPagedApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

}
