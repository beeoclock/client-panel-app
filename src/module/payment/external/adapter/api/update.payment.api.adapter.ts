import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";
import {PaymentEndpoint} from "@module/payment/external/endpoint/payment.endpoint";

@Injectable({
    providedIn: 'root'
})
export class UpdatePaymentApiAdapter extends BaseApiAdapter<IPaymentDto, [string, IPaymentDto]> {

    /**
     * @param id
     * @param body
     */
    public override execute$(id: string, body: IPaymentDto) {
        return this.httpClient.put<IPaymentDto>(PaymentEndpoint.UPDATE, body, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {id})
        });
    }

}
