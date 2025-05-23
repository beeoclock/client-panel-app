import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {GetApi} from "@tenant/plugin/plugin/infrastructure/data-source/api/get.api";
import {IPlugin} from "@tenant/plugin/plugin/domain";
import {GetFunctions} from "@tenant/plugin/plugin/infrastructure/data-source/api/get-functions.api";

;

@Injectable()
export class ApiDataProvider extends DataProvider<IPlugin.DTO> {

	private readonly getApi = inject(GetApi);
	private readonly getFunctions = inject(GetFunctions);


	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}


}
