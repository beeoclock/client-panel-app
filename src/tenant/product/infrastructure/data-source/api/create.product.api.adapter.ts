import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {productEndpointEnum} from '@tenant/product/endpoint/product.endpoint';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";
import {IProduct} from "@tenant/product/domain";

@Injectable()
export class CreateProductApiAdapter extends BaseApiAdapter<
	IProduct.DTO,
	[IProduct.DTO]
> {
	/**
	 * SAVE NEW PRODUCT
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IProduct.DTO) {
		return this.httpClient.post<IProduct.DTO>(
			productEndpointEnum.postCreateProduct,
			value
		);
	}
}
