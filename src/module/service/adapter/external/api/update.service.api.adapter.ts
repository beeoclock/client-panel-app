import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class UpdateServiceApiAdapter extends BaseApiAdapter<Service.IService> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Service.IService) {
		return this.httpClient.put<Service.IService>(serviceEndpointEnum.update, value, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: value._id,
			}),
    });
  }

}
