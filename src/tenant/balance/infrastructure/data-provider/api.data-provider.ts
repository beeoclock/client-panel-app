import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostApi} from "@tenant/balance/infrastructure/data-source/api/post.api";
import {GetApi} from "@tenant/balance/infrastructure/data-source/api/get.api";
import {Types} from "@core/shared/types";
import {IBalance} from "@tenant/balance/domain";
import {GetLastItemApi} from "@tenant/balance/infrastructure/data-source/api/get-last-item.api";

@Injectable()
export class ApiDataProvider extends DataProvider<IBalance.DTO> {

	private readonly postApi = inject(PostApi);
	private readonly getApi = inject(GetApi);
	private readonly getLastItemApi = inject(GetLastItemApi);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IBalance.DTO) {
		return this.postApi.execute$(dto);
	}

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.getApi.execute$(options);
	}

}
