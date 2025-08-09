import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";
import {ProductTagEndpointEnum} from "@tenant/product/product-tag/endpoint/product-tag.endpoint";

type ResponseType = {};

@Injectable()
export class DeleteProductTagApiAdapter extends BaseApiAdapter<
	ResponseType,
	[string]
> {
	/**
	 * DELETE PRODUCT BY ID
	 * @param id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.delete<ResponseType>(
			ProductTagEndpointEnum.deleteProduct,
			{
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id,
				}),
			}
		);
	}
}
