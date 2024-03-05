import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/endpoint/identity.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {ProviderTypeEnum} from "@identity/domain/enum/provider-type.enum";

@Injectable({
  providedIn: 'root'
})
export class RegisterDeviceApiAdapter extends BaseApiAdapter<unknown> {

  /**
   *
   * @param body
   */
	@TypeGuard([is.object])
  public override execute$(body: {
		providerType: ProviderTypeEnum;
		deviceToken: string;
		prevDeviceToken: string;
  }) {
    return this.httpClient.post<unknown>(identityEndpointEnum.postRegisterDevice, body);
  }

}
