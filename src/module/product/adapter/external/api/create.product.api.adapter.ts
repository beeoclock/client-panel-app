import { Injectable } from '@angular/core';
import { BaseApiAdapter } from '@utility/adapter/base.api.adapter';
import { TypeGuard } from '@p4ck493/ts-type-guard';
import { is } from '@utility/checker';
import { productEndpointEnum } from '@src/module/product/endpoint/product.endpoint';
import * as Product from "@product/domain";

@Injectable({
	providedIn: 'root',
})
export class CreateProductApiAdapter extends BaseApiAdapter<
	Product.IProduct,
	[Product.IProduct]
> {
	/**
	 * SAVE NEW PRODUCT
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: Product.IProduct) {
		return this.httpClient.post<Product.IProduct>(
			productEndpointEnum.postCreateProduct,
			value
		);
	}
}
