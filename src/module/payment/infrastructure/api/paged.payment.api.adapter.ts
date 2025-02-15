import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {PaymentEndpoint} from '../endpoint/payment.endpoint';
import {IPaymentDto} from "@src/core/business-logic/payment/interface/i.payment";

type TParams = TableState_BackendFormat;

@Injectable({
    providedIn: 'root'
})
export class PagedPaymentApiAdapter extends BaseApiAdapter<ResponseListType<IPaymentDto>, [TParams]> {


    /**
     * GET PAGED LIST BY FILTERS AND PARAMS
     * @param params
     */
    @TypeGuard([is.object_not_empty])
    public override execute$(params: TParams) {
        return this.httpClient.get<ResponseListType<IPaymentDto>>(PaymentEndpoint.PAGED, {
            params: params as never,
        });
    }

}
