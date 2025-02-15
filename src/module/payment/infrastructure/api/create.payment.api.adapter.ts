import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {PaymentEndpoint} from "@module/payment/infrastructure/endpoint/payment.endpoint";
import {IPaymentDto} from "@src/core/business-logic/payment/interface/i.payment";

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
