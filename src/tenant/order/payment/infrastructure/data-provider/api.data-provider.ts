import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {PostApi} from "@tenant/order/payment/infrastructure/data-source/api/post.api";
import {GetApi} from "@tenant/order/payment/infrastructure/data-source/api/get.api";
import {PutApi} from "@tenant/order/payment/infrastructure/data-source/api/put.api";
import {Types} from "@core/shared/types";
import {GetItemApi} from "@tenant/order/payment/infrastructure/data-source/api/get-item.api";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";

@Injectable()
export class ApiDataProvider extends DataProvider<IPayment.DTO> {

	private readonly postApi = inject(PostApi);
	private readonly getApi = inject(GetApi);
	private readonly getItemApi = inject(GetItemApi);
	private readonly putApi = inject(PutApi);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IPayment.DTO) {
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
	public override update$(dto: IPayment.DTO) {
		return this.putApi.execute$(dto);
	}

}
