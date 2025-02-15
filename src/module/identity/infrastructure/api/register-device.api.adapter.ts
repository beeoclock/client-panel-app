import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/infrastructure/endpoint/identity.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {ProviderTypeEnum} from "@identity/domain/enum/provider-type.enum";

type TBody = {
	providerType: ProviderTypeEnum;
	deviceToken: string | null;
	prevDeviceToken: string;
};

@Injectable({
  providedIn: 'root'
})
export class RegisterDeviceApiAdapter extends BaseApiAdapter<unknown, [TBody]> {

  /**
   *
   * @param body
   */
	@TypeGuard([is.object])
  public override execute$(body: TBody) {
    return this.httpClient.post<unknown>(identityEndpointEnum.postRegisterDevice, body);
  }

}
