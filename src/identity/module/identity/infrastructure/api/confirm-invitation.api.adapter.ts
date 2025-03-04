import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@src/identity/module/identity/infrastructure/endpoint/identity.endpoint";
import {Injectable} from "@angular/core";
import {IBodyConfirmInvitation} from "@src/identity/module/identity/domain/interface/i.confirm-invitation";

@Injectable({
	providedIn: 'root'
})
export class ConfirmInvitationApiAdapter extends BaseApiAdapter<unknown, [IBodyConfirmInvitation]> {
	override execute$(body: IBodyConfirmInvitation) {
		return this.httpClient.post(identityEndpointEnum.confirmInvitation, body);
	}
}
