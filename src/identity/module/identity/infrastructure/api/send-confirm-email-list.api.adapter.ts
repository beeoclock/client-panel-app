import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@src/identity/module/identity/infrastructure/endpoint/identity.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";

type TBody = {
	email: string
};

@Injectable({
  providedIn: 'root'
})
export class SendConfirmEmailListApiAdapter extends BaseApiAdapter<unknown, [TBody]> {

  /**
   *
   * @param body
   */
	@TypeGuard([is.object])
  public override execute$(body: TBody) {
    return this.httpClient.post<unknown>(identityEndpointEnum.confirmEmail, body);
  }

}
