import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {PaymentEndpoint} from "@payment/external/endpoint/payment.endpoint";
import {IPaymentDto} from "@payment/domain/interface/dto/i.payment.dto";

@Injectable({
    providedIn: 'root'
})
export class CreatePaymentApiAdapter extends BaseApiAdapter<IPaymentDto, [IPaymentDto]> {

    /**
     * @param body
     */
    public override execute$(body: IPaymentDto) {

        return this.httpClient.post<IPaymentDto>(PaymentEndpoint.CREATE, body);
    }

}
