import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable} from "@angular/core";
import {Types} from "@core/shared/types";
import {
	CreateProductTagApiAdapter
} from "@tenant/product-tag/infrastructure/data-source/api/create.product-tag.api.adapter";
import {
	ListProductTagApiAdapter
} from "@tenant/product-tag/infrastructure/data-source/api/list.product-tag.api.adapter";
import {
	ItemProductTagApiAdapter
} from "@tenant/product-tag/infrastructure/data-source/api/item.product-tag.api.adapter";
import {
	UpdateProductTagApiAdapter
} from "@tenant/product-tag/infrastructure/data-source/api/update.product-tag.api.adapter";
import {IProductTag} from "@tenant/product-tag/domain";

@Injectable()
export class ApiDataProvider extends DataProvider<IProductTag.DTO> {

	private readonly postApi = inject(CreateProductTagApiAdapter);
	private readonly getApi = inject(ListProductTagApiAdapter);
	private readonly getItemApi = inject(ItemProductTagApiAdapter);
	private readonly putApi = inject(UpdateProductTagApiAdapter);

	/**
	 *
	 * @param dto
	 */
	public override create$(dto: IProductTag.DTO) {
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
	public override update$(dto: IProductTag.DTO) {
		return this.putApi.execute$(dto);
	}

}
