import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostApi} from "@service/infrastructure/api/post.api";
import {GetApi} from "@service/infrastructure/api/get.api";
import {PutApi} from "@service/infrastructure/api/put.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@service/infrastructure/api/get-item.api";
import {IService} from "@core/business-logic/service/interface/i.service";

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

	/**
	 *
	 * @param dto
	 */
	public override update$(dto: IService.DTO) {
		return this.putApi.execute$(dto);
	}

}
