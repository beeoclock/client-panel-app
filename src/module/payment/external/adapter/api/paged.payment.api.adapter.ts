import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {PaymentEndpoint} from '../../endpoint/payment.endpoint';
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

@Injectable({
    providedIn: 'root'
})
export class PagedPaymentApiAdapter extends BaseApiAdapter<ResponseListType<IPaymentDto>, [TableState_BackendFormat]> {


    /**
     * GET PAGED LIST BY FILTERS AND PARAMS
     * @param params
     */
    @TypeGuard([is.object_not_empty])
    public override execute$(params: TableState_BackendFormat) {
        return this.httpClient.get<ResponseListType<IPaymentDto>>(PaymentEndpoint.PAGED, {
            params: params as never,
        });
    }

}
