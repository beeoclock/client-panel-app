import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {GetApi} from "@tenant/balance/infrastructure/data-source/api/get.api";
import {Types} from "@core/shared/types";
import {IBalance} from "@tenant/balance/domain";

@Injectable()
export class ApiDataProvider extends DataProvider<IBalance.DTO> {

	private readonly getApi = inject(GetApi);

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

}
