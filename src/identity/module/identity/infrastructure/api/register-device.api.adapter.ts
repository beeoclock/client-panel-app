import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@src/identity/module/identity/infrastructure/endpoint/identity.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {ProviderTypeEnum} from "@src/identity/module/identity/domain/enum/provider-type.enum";

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
