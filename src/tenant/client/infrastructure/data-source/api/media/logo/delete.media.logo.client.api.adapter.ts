import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@tenant/client/infrastructure/endpoint/business-profile.media.endpoint";

@Injectable({
	providedIn: 'root'
})
export class DeleteMediaLogoClientApiAdapter extends BaseApiAdapter<unknown> {

	public override execute$() {
		return this.httpClient.delete<unknown>(businessProfileMediaEndpointEnum.deleteLogo);
	}

}
