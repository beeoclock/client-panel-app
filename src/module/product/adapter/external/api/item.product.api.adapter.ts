import { Injectable } from '@angular/core';;
import { BaseApiAdapter } from '@utility/adapter/base.api.adapter';
import { HttpContext } from '@angular/common/http';
import { TokensHttpContext } from '@src/tokens.http-context';
import * as Product from "@product/domain";
import { productEndpointEnum } from '@src/module/product/endpoint/product.endpoint';

@Injectable({
	providedIn: 'root',
})
export class ItemProductApiAdapter extends BaseApiAdapter<Product.IProduct, [string]> {
	/**
	 * GET PRODUCT BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<Product.IProduct>(productEndpointEnum.getProduct, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}
}
