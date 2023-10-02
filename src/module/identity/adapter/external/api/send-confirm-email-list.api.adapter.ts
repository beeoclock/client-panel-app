import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/endpoint/identity.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class SendConfirmEmailListApiAdapter extends BaseApiAdapter<unknown> {

  /**
   *
   * @param body
   */
	@TypeGuard([is.object])
  public override execute$(body: {
    email: string
  }) {
    return this.httpClient.post<unknown>(identityEndpointEnum.confirmEmail, body);
  }

}
