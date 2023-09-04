import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {clientMediaEndpointEnum} from "@client/endpoint/client.media.endpoint";
import {RIMedia} from "@module/media/domain/interface/i.media";

@Injectable({
	providedIn: 'root'
})
export class PatchMediaLogoClientApiAdapter extends BaseApiAdapter<RIMedia> {

	/**
	 * Send in bady media id to edit existing media, send in body media id = null/undefined to create new media
	 * @param body
	 */
	public override execute$(body: { media: string; _id?: string; }) {
		return this.httpClient.patch<RIMedia>(clientMediaEndpointEnum.patchLogo, body);
	}

}
