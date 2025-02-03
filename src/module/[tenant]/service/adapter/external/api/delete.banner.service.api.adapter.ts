import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
	providedIn: 'root'
})
export class DeleteBannerServiceApiAdapter extends BaseApiAdapter<unknown, [string, string]> {


	/**
	 * GET ITEM BY ID
	 * @param serviceId
	 * @param id
	 */
	public override execute$(serviceId: string, id: string) {
		return this.httpClient.delete<unknown>(serviceEndpointEnum.deleteBanners, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				serviceId,
				id,
			}),
		});
	}

}
