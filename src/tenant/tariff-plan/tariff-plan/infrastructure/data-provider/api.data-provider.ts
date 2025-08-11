import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {GetApi} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/get/get.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@tenant/tariff-plan/tariff-plan/infrastructure/data-source/api/get/get-item.api";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";
import { of } from "rxjs";

@Injectable()
export class ApiDataProvider extends DataProvider<ITariffPlan.DTO> {

	private readonly getApi = inject(GetApi);
	private readonly getItemApi = inject(GetItemApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams = {}) {
		return this.getApi.execute$(options);
	}

	/**
	 *
	 * @param id
	 */
	public override findById$(id: string) {
		return this.getItemApi.execute$(id);
	}

	public override create$(data: ITariffPlan.DTO) {
		return of(data);
	}

	public override update$(data: ITariffPlan.DTO) {
		return of(data);
	}

}
