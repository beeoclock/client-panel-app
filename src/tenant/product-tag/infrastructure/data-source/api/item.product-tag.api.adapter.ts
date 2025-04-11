import {Injectable} from '@angular/core';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {IProductTag} from "@tenant/product-tag/domain";
import {ProductTagEndpointEnum} from "@tenant/product-tag/endpoint/product-tag.endpoint";

@Injectable()
export class ItemProductTagApiAdapter extends BaseApiAdapter<IProductTag.DTO, [string]> {
	/**
	 * GET PRODUCT BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IProductTag.DTO>(ProductTagEndpointEnum.getProduct, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}
}
