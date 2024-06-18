import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {OrderEndpoint} from "@module/order/external/endpoint/order.endpoint";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
    providedIn: 'root'
})
export class UpdateOrderApiAdapter extends BaseApiAdapter<IOrderDto, [IOrderDto]> {

    /**
		 * @param body
		 */
    public override execute$(body: IOrderDto) {
        return this.httpClient.put<IOrderDto>(OrderEndpoint.UPDATE, body, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
							id: body._id
						})
        });
    }

}
