import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {businessProfileMediaEndpointEnum} from "@tenant/client/infrastructure/endpoint/business-profile.media.endpoint";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
	providedIn: 'root'
})
export class DeleteMediaBannersClientApiAdapter extends BaseApiAdapter<unknown, [string]> {

	/**
	 *
	 * @param id - media id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.delete<unknown>(businessProfileMediaEndpointEnum.deleteBanners, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
