import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {productEndpointEnum} from "@tenant/product/product/endpoint/product.endpoint";

@Injectable()
export class DeleteImageProductApiAdapter extends BaseApiAdapter<unknown, [string, string]> {


	/**
	 * GET ITEM BY ID
	 * @param productId
	 * @param id
	 */
	public override execute$(productId: string, id: string) {
		return this.httpClient.delete<unknown>(productEndpointEnum.deleteImage, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				productId,
				id,
			}),
		});
	}

}
