import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {PaymentEndpoint} from '../endpoint/payment.endpoint';
import {IPayment} from "@src/core/business-logic/payment/interface/i.payment";
import {Types} from "@core/shared/types";

type TParams = Types.FindQueryParams;

@Injectable({
	providedIn: 'root'
})
export class GetApi extends BaseApiAdapter<ResponseListType<IPayment.DTO>, [TParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TParams) {
		return this.httpClient.get<ResponseListType<IPayment.DTO>>(PaymentEndpoint.PAGED, {
			params: params as never,
		});
	}

}
