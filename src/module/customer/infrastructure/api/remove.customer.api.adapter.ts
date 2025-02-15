import {Injectable} from '@angular/core';
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';

type ResponseType = {
  deletedCount: number
};

@Injectable({
  providedIn: 'root'
})
export class RemoveCustomerApiAdapter extends BaseApiAdapter<ResponseType, [string]> {

  /**
   * DELETE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string])
  public override execute$(id: string) {
    return this.httpClient.delete<ResponseType>(customerEndpointEnum.delete, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
