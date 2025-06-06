import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@tenant/order/order/infrastructure/endpoint/order.endpoint";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";

@Injectable({
    providedIn: 'root'
})
export class PatchStatusOrderApiAdapter extends BaseApiAdapter<IOrder.DTO, [string, OrderStatusEnum]> {

    /**
     * @param id
     * @param status
     */
    public override execute$(id: string, status: OrderStatusEnum) {
        return this.httpClient.patch<IOrder.DTO>(OrderEndpoint.UPDATE_STATUS, null, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
                id,
                status
            })
        });
    }

}
