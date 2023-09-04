import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {clientMediaEndpointEnum} from "@client/endpoint/client.media.endpoint";

@Injectable({
	providedIn: 'root'
})
export class DeleteMediaGalleryClientApiAdapter extends BaseApiAdapter<unknown> {

	public override execute$() {
		return this.httpClient.delete<unknown>(clientMediaEndpointEnum.deleteLogo);
	}

}
