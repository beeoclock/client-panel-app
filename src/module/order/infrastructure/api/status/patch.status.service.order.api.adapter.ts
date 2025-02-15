import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {OrderServiceStatusEnum} from "@src/core/business-logic/order/enum/order-service.status.enum";

@Injectable({
    providedIn: 'root'
})
export class PatchStatusServiceOrderApiAdapter extends BaseApiAdapter<IOrderDto, [string, string, OrderServiceStatusEnum]> {

    /**
		 * @param orderId
		 * @param serviceId
		 * @param status
		 */
    public override execute$(orderId: string, serviceId: string, status: OrderServiceStatusEnum) {
        return this.httpClient.patch<IOrderDto>(OrderEndpoint.UPDATE_SERVICE_STATUS, null, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
                id: orderId,
                serviceId,
                status
            })
        });
    }

}
