import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@client/endpoint/business-profile.media.endpoint";
import {RIMedia} from "@module/media/domain/interface/i.media";

@Injectable({
	providedIn: 'root'
})
export class PatchMediaGalleryClientApiAdapter extends BaseApiAdapter<RIMedia> {

	/**
	 * Send in bady media id to edit existing media, send in body media id = null/undefined to create new media
	 * @param body
	 */
	public override execute$(body: { media: string; _id?: string; }) {
		return this.httpClient.patch<RIMedia>(businessProfileMediaEndpointEnum.patchGallery, body);
	}

}
