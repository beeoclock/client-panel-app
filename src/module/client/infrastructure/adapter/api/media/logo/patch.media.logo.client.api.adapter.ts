import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@client/infrastructure/endpoint/business-profile.media.endpoint";
import {RIMedia} from "@module/media/domain/interface/i.media";

@Injectable({
	providedIn: 'root'
})
export class PatchMediaLogoClientApiAdapter extends BaseApiAdapter<RIMedia, [FormData]> {

	/**
	 * Send in bady media id to edit existing media, send in body media id = null/undefined to create new media
	 * @param body
	 */
	public override execute$(body: FormData) {
		return this.httpClient.patch<RIMedia>(businessProfileMediaEndpointEnum.patchLogo, body);
	}

}
