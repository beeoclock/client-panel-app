import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {productEndpointEnum} from '@tenant/product/endpoint/product.endpoint';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";

type ResponseType = {};

@Injectable()
export class DeleteProductApiAdapter extends BaseApiAdapter<
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
			productEndpointEnum.deleteProduct,
			{
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id,
				}),
			}
		);
	}
}
