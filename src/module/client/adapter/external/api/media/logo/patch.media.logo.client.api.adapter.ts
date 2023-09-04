import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {clientMediaEndpointEnum} from "@client/endpoint/client.media.endpoint";

@Injectable({
	providedIn: 'root'
})
export class PatchMediaLogoClientApiAdapter extends BaseApiAdapter<unknown> {

	/**
	 * Send in bady media id to edit existing media, send in body media id = null/undefined to create new media
	 * @param body
	 */
	public override execute$(body: unknown) {
		return this.httpClient.patch<unknown>(clientMediaEndpointEnum.patchLogo, body);
	}

}
