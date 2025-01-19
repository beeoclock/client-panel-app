import { HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { is } from '@p4ck493/checker';
import { TypeGuard } from '@p4ck493/ts-type-guard';
import * as Product from "@product/domain";
import { productEndpointEnum } from '@src/module/product/endpoint/product.endpoint';
import { BaseApiAdapter } from '@src/module/utility/adapter/base.api.adapter';
import { TokensHttpContext } from '@src/tokens.http-context';

@Injectable({
	providedIn: 'root',
})
export class UpdateProductApiAdapter extends BaseApiAdapter<
	Product.IProduct,
	[Product.IProduct]
> {
	/**
	 * UPDATE PRODUCT BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: Product.IProduct) {
		return this.httpClient.put<Product.IProduct>(
			productEndpointEnum.putUpdateProduct,
			value,
			{
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id: value._id,
				}),
			}
		);
	}
}
