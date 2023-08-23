import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/endpoint/identity.endpoint";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ChangePhoneNumberApiAdapter extends BaseApiAdapter<unknown> {
  override execute$(body: { name: string }) {
    return this.httpClient.patch(identityEndpointEnum.patchChangePhoneNumber, body);
  }
}
