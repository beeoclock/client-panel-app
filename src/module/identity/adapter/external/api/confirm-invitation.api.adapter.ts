import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/endpoint/identity.endpoint";
import {Injectable} from "@angular/core";
import {IConfirmInvitation} from "@identity/domain/interface/i.confirm-invitation";

@Injectable({
	providedIn: 'root'
})
export class ConfirmInvitationApiAdapter extends BaseApiAdapter<unknown, [IConfirmInvitation]> {
	override execute$(body: IConfirmInvitation) {
		return this.httpClient.post(identityEndpointEnum.confirmInvitation, body);
	}
}
