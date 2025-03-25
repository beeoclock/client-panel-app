import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@[tenant]/order/infrastructure/endpoint/order.endpoint";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";

@Injectable({
    providedIn: 'root'
})
export class PatchStatusServiceOrderApiAdapter extends BaseApiAdapter<IOrder.DTO, [string, string, OrderServiceStatusEnum]> {

    /**
		 * @param orderId
		 * @param serviceId
		 * @param status
		 */
    public override execute$(orderId: string, serviceId: string, status: OrderServiceStatusEnum) {
        return this.httpClient.patch<IOrder.DTO>(OrderEndpoint.UPDATE_SERVICE_STATUS, null, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
                id: orderId,
                serviceId,
                status
            })
        });
    }

}
