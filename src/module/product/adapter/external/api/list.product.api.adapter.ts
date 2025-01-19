import { Injectable } from '@angular/core';
import { TableState_BackendFormat } from '@utility/domain/table.state';
import { BaseApiAdapter } from '@utility/adapter/base.api.adapter';
import { TypeGuard } from '@p4ck493/ts-type-guard';
import { is } from '@utility/checker';
import * as Product from "@product/domain";
import { productEndpointEnum } from '@src/module/product/endpoint/product.endpoint';

type ResponseType = {
	items: Product.IProduct[];
	totalSize: number;
};

@Injectable({
	providedIn: 'root',
})
export class ListProductApiAdapter extends BaseApiAdapter<
	ResponseType,
	[TableState_BackendFormat]
> {
	/**
	 * GET PAGED PRODUCTS BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseType>(productEndpointEnum.getPagedProducts, {
			params: params as never,
		});
	}
}
