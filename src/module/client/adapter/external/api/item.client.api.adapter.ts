import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Client from "@client/domain";
import {clientEndpointEnum} from "@client/endpoint/client.endpoint";

@Injectable({
  providedIn: 'root'
})
export class ItemClientApiAdapter extends BaseApiAdapter<Client.IClient> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.post<Client.IClient>(clientEndpointEnum.item, null, {
      // headers: {
      //   replace: JSON.stringify({
      //     id
      //   })
      // }
    });
  }

}
