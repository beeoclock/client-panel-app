import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostApi} from "@tenant/customer/infrastructure/data-source/api/post.api";
import {GetApi} from "@tenant/customer/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/customer/infrastructure/data-source/api/put.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@tenant/customer/infrastructure/data-source/api/get-item.api";
import {ICustomer} from "@core/business-logic/customer";

@Injectable()
export class ApiDataProvider extends DataProvider<ICustomer.DTO> {

	private readonly postApi = inject(PostApi);
	private readonly getApi = inject(GetApi);
	private readonly getItemApi = inject(GetItemApi);
	private readonly putApi = inject(PutApi);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: ICustomer.DTO) {
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
	public override update$(dto: ICustomer.DTO) {
		return this.putApi.execute$(dto);
	}

}
