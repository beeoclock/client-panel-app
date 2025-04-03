import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {is} from "@core/shared/checker";
import {ProductTagEndpointEnum} from '@tenant/product-tag/endpoint/product-tag.endpoint';

@Injectable()
export class ArchiveProductTagApiAdapter extends BaseApiAdapter<
	unknown,
	[string]
> {
	/**
	 * ARCHIVE ITEM BY ID
	 * @param id
	 */
	@TypeGuard([is.string_not_empty])
	public override execute$(id: string) {
		return this.httpClient.patch(ProductTagEndpointEnum.archive, null, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}
}
