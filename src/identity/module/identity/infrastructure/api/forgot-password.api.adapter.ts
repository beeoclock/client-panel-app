import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@src/identity/module/identity/infrastructure/endpoint/identity.endpoint";

type TBody = {
	email: string
};

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordApiAdapter extends BaseApiAdapter<unknown, [TBody]> {

  /**
   *
   * @param body
   */
  public override execute$(body: TBody) {
    return this.httpClient.post<unknown>(identityEndpointEnum.postResetPassword, body);
  }

}
