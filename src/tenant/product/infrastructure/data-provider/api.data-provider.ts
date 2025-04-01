import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {IProduct} from "@tenant/product/domain";
import {CreateProductApiAdapter} from "@tenant/product/infrastructure/data-source/api/create.product.api.adapter";
import {ListProductApiAdapter} from "@tenant/product/infrastructure/data-source/api/list.product.api.adapter";
import {ItemProductApiAdapter} from "@tenant/product/infrastructure/data-source/api/item.product.api.adapter";
import {UpdateProductApiAdapter} from "@tenant/product/infrastructure/data-source/api/update.product.api.adapter";

@Injectable()
export class ApiDataProvider extends DataProvider<IProduct.DTO> {

	private readonly postApi = inject(CreateProductApiAdapter);
	private readonly getApi = inject(ListProductApiAdapter);
	private readonly getItemApi = inject(ItemProductApiAdapter);
	private readonly putApi = inject(UpdateProductApiAdapter);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IProduct.DTO) {
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
	public override update$(dto: IProduct.DTO) {
		return this.putApi.execute$(dto);
	}

}
