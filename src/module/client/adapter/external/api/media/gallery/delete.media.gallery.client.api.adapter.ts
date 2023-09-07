import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@client/endpoint/business-profile.media.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
	providedIn: 'root'
})
export class DeleteMediaGalleryClientApiAdapter extends BaseApiAdapter<unknown> {

	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.delete<unknown>(businessProfileMediaEndpointEnum.deleteGallery, {
			headers: {
				replace: JSON.stringify({
					id
				})
			}
		});
	}

}
