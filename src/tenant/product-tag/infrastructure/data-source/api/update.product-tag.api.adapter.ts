import {HttpContext} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {is} from '@p4ck493/checker';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {TokensHttpContext} from '@src/tokens.http-context';
import {IProductTag} from "@tenant/product-tag/domain";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {ProductTagEndpointEnum} from "@tenant/product-tag/endpoint/product-tag.endpoint";

@Injectable()
export class UpdateProductTagApiAdapter extends BaseApiAdapter<
	IProductTag.DTO,
	[IProductTag.DTO]
> {
	/**
	 * UPDATE PRODUCT BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IProductTag.DTO) {
		return this.httpClient.put<IProductTag.DTO>(
			ProductTagEndpointEnum.putUpdateProduct,
			value,
			{
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id: value._id,
				}),
			}
		);
	}
}
