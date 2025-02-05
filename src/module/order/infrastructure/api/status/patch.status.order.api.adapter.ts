import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {IOrderDto} from "@order/domain/interface/details/i.order.dto";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";

@Injectable({
    providedIn: 'root'
})
export class PatchStatusOrderApiAdapter extends BaseApiAdapter<IOrderDto, [string, OrderStatusEnum]> {

    /**
     * @param id
     * @param status
     */
    public override execute$(id: string, status: OrderStatusEnum) {
        return this.httpClient.patch<IOrderDto>(OrderEndpoint.UPDATE_STATUS, null, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
                id,
                status
            })
        });
    }

}
