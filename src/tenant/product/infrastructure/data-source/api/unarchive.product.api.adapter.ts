import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {productEndpointEnum} from '@tenant/product/endpoint/product.endpoint';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";

@Injectable()
export class UnarchiveProductApiAdapter extends BaseApiAdapter<
	unknown,
	[string]
> {
	/**
	 * ARCHIVE ITEM BY ID
	 * @param id
	 */
	@TypeGuard([is.string_not_empty])
	public override execute$(id: string) {
		return this.httpClient.patch(
			productEndpointEnum.unarchive,
			null,
			{
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id,
				}),
			}
		);
	}
}
