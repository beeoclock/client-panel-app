import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostApi} from "@tenant/service/infrastructure/data-source/api/post.api";
import {GetApi} from "@tenant/service/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/service/infrastructure/data-source/api/put.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@tenant/service/infrastructure/data-source/api/get-item.api";
import {IService} from "@tenant/service/domain/interface/i.service";

@Injectable()
export class ApiDataProvider extends DataProvider<IService.DTO> {

	private readonly postApi = inject(PostApi);
	private readonly getApi = inject(GetApi);
	private readonly getItemApi = inject(GetItemApi);
	private readonly putApi = inject(PutApi);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IService.DTO) {
		return this.postApi.execute$(dto);
	}

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

	/**
	 *
	 * @param dto
	 */
	public override update$(dto: IService.DTO) {
		return this.putApi.execute$(dto);
	}

}
