import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {GetApi} from "@tenant/tariff-plan/infrastructure/data-source/api/get/get.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@tenant/tariff-plan/infrastructure/data-source/api/get/get-item.api";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";

@Injectable()
export class ApiDataProvider extends DataProvider<ITariffPlan.DTO> {

	private readonly getApi = inject(GetApi);
	private readonly getItemApi = inject(GetItemApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

	/**
	 *
	 * @param id
	 */
	public override findById$(id: string) {
		return this.getItemApi.execute$(id);
	}

}
