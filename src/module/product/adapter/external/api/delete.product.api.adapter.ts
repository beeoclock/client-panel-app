import { Injectable } from '@angular/core';
import { BaseApiAdapter } from '@utility/adapter/base.api.adapter';
import { TypeGuard } from '@p4ck493/ts-type-guard';
import { is } from '@utility/checker';
import { HttpContext } from '@angular/common/http';
import { TokensHttpContext } from '@src/tokens.http-context';
import { productEndpointEnum } from '@src/module/product/endpoint/product.endpoint';

type ResponseType = {};

@Injectable({
	providedIn: 'root',
})
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
