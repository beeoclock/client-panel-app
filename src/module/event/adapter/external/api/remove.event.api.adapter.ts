import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

type ResponseType = {
  deletedCount: number
};

@Injectable({
  providedIn: 'root'
})
export class RemoveEventApiAdapter extends BaseApiAdapter<ResponseType> {

  /**
   * DELETE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string])
  public override execute$(id: string) {
    return this.httpClient.delete<ResponseType>(eventEndpointEnum.delete, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
