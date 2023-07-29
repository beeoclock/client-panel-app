import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

type ResponseType = {
  items: Event.IEvent[];
  totalSize: number;
};

@Injectable({
  providedIn: 'root'
})
export class ListEventApiAdapter extends BaseApiAdapter<ResponseType> {


  /**
   * GET PAGED LIST BY FILTERS AND PARAMS
   * @param params
   */
  @TypeGuard([is.object.not.empty])
  public override execute$(params: TableState_BackendFormat) {
    return this.httpClient.post<ResponseType>(eventEndpointEnum.paged, params);
  }

}
