import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/identity/infrastructure/endpoint/identity.endpoint";
import {Injectable} from "@angular/core";

type TBody = { name?: string; };

@Injectable({
  providedIn: 'root'
})
export class ChangeNameApiAdapter extends BaseApiAdapter<unknown, [TBody]> {
  override execute$(body: TBody) {
    return this.httpClient.patch(identityEndpointEnum.patchChangeName, body);
  }
}
