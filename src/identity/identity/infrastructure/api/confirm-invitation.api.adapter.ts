import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {identityEndpointEnum} from "@identity/identity/infrastructure/endpoint/identity.endpoint";
import {Injectable} from "@angular/core";
import {IBodyConfirmInvitation} from "@identity/identity/domain/interface/i.confirm-invitation";

@Injectable({
	providedIn: 'root'
})
export class ConfirmInvitationApiAdapter extends BaseApiAdapter<unknown, [IBodyConfirmInvitation]> {
	override execute$(body: IBodyConfirmInvitation) {
		return this.httpClient.post(identityEndpointEnum.confirmInvitation, body);
	}
}
