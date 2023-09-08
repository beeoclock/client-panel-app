import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@client/endpoint/business-profile.media.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
	providedIn: 'root'
})
export class DeleteMediaBannersClientApiAdapter extends BaseApiAdapter<unknown> {

	/**
	 *
	 * @param id - media id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.delete<unknown>(businessProfileMediaEndpointEnum.deleteBanners, {
			headers: {
				replace: JSON.stringify({
					id
				})
			}
		});
	}

}
