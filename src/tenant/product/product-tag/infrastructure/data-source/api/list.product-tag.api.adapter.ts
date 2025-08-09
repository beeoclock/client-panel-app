import {Injectable} from '@angular/core';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {IProductTag} from "@tenant/product/product-tag/domain";
import {TableState_BackendFormat} from "@shared/domain/table.state";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";
import {ProductTagEndpointEnum} from "@tenant/product/product-tag/endpoint/product-tag.endpoint";

type ResponseType = {
	items: IProductTag.DTO[];
	totalSize: number;
};

@Injectable()
export class ListProductTagApiAdapter extends BaseApiAdapter<
	ResponseType,
	[TableState_BackendFormat]
> {
	/**
	 * GET PAGED PRODUCTS BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseType>(ProductTagEndpointEnum.getPagedProducts, {
			params: params as never,
		});
	}
}
