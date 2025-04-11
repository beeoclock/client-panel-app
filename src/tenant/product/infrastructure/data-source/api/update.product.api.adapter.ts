import {HttpContext} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {is} from '@p4ck493/checker';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {productEndpointEnum} from '@tenant/product/endpoint/product.endpoint';
import {TokensHttpContext} from '@src/tokens.http-context';
import {IProduct} from "@tenant/product/domain";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";

@Injectable()
export class UpdateProductApiAdapter extends BaseApiAdapter<
	IProduct.DTO,
	[IProduct.DTO]
> {
	/**
	 * UPDATE PRODUCT BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IProduct.DTO) {
		return this.httpClient.put<IProduct.DTO>(
			productEndpointEnum.putUpdateProduct,
			value,
			{
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id: value._id,
				}),
			}
		);
	}
}
