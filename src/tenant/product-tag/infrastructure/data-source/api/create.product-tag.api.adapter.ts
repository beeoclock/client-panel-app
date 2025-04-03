import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {ProductTagEndpointEnum} from '@tenant/product-tag/endpoint/product-tag.endpoint';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";
import {IProductTag} from "@tenant/product-tag/domain";

@Injectable()
export class CreateProductTagApiAdapter extends BaseApiAdapter<
	IProductTag.DTO,
	[IProductTag.DTO]
> {
	/**
	 * SAVE NEW PRODUCT
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IProductTag.DTO) {
		return this.httpClient.post<IProductTag.DTO>(
			ProductTagEndpointEnum.postCreateProduct,
			value
		);
	}
}
