import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";

@Injectable({
    providedIn: 'root'
})
export class DeleteOrderApiAdapter extends BaseApiAdapter<void, [string]> {


    /**
     * GET ITEM BY ID
     * @param id
     */
    public override execute$(id: string) {
        return this.httpClient.delete<void>(OrderEndpoint.DELETE, {
            context: new HttpContext().set(TokensHttpContext.REPLACE, {
                id
            }),
        });
    }

}
