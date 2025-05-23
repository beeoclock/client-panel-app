import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";
import {productEndpointEnum} from "@tenant/product/product/endpoint/product.endpoint";

@Injectable()
export class ArchiveProductApiAdapter extends BaseApiAdapter<
	unknown,
	[string]
> {
	/**
	 * ARCHIVE ITEM BY ID
	 * @param id
	 */
	@TypeGuard([is.string_not_empty])
	public override execute$(id: string) {
		return this.httpClient.patch(productEndpointEnum.archive, null, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}
}
