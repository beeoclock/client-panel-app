import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@client/endpoint/business-profile.media.endpoint";

@Injectable({
	providedIn: 'root'
})
export class GetMediaLogoClientApiAdapter extends BaseApiAdapter<unknown> {

	public override execute$() {
		return this.httpClient.get<unknown>(businessProfileMediaEndpointEnum.getLogo);
	}

}
