import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/endpoint/identity.endpoint";

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordApiAdapter extends BaseApiAdapter<unknown> {

  /**
   *
   * @param body
   */
  public override execute$(body: {
    email: string
  }) {
    return this.httpClient.post<unknown>(identityEndpointEnum.postResetPassword, body);
  }

}
