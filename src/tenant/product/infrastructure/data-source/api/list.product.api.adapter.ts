import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {productEndpointEnum} from '@tenant/product/endpoint/product.endpoint';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {IProduct} from "@tenant/product/domain";
import {TableState_BackendFormat} from "@shared/domain/table.state";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";

type ResponseType = {
	items: IProduct.DTO[];
	totalSize: number;
};

@Injectable()
export class ListProductApiAdapter extends BaseApiAdapter<
	ResponseType,
	[TableState_BackendFormat]
> {
	/**
	 * GET PAGED PRODUCTS BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseType>(productEndpointEnum.getPagedProducts, {
			params: params as never,
		});
	}
}
