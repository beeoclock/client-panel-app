import {Injectable} from '@angular/core';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {productEndpointEnum} from '@tenant/product/endpoint/product.endpoint';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {IProduct} from "@tenant/product/domain";

@Injectable()
export class ItemProductApiAdapter extends BaseApiAdapter<IProduct.DTO, [string]> {
	/**
	 * GET PRODUCT BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IProduct.DTO>(productEndpointEnum.getProduct, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}
}
