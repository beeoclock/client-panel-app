import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/infrastructure/endpoint/identity.endpoint";
import {Injectable} from "@angular/core";

type TBody = { phoneNumber?: string };

@Injectable({
  providedIn: 'root'
})
export class ChangePhoneNumberApiAdapter extends BaseApiAdapter<unknown, [TBody]> {
  override execute$(body: TBody) {
    return this.httpClient.patch(identityEndpointEnum.patchChangePhoneNumber, body);
  }
}
