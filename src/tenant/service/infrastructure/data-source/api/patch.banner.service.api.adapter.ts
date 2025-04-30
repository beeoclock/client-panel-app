import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@tenant/service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {RIMedia} from "@tenant/media/domain/interface/i.media";

@Injectable({
	providedIn: 'root'
})
export class PatchBannerServiceApiAdapter extends BaseApiAdapter<RIMedia, [string, FormData]> {

	/**
	 * GET ITEM BY ID
	 * @param id
	 * @param body
	 */
	public override execute$(id: string, body: FormData) {
		return this.httpClient.patch<RIMedia>(serviceEndpointEnum.patchBanners, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
