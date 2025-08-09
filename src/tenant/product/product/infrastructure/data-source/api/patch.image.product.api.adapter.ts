import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {RIMedia} from "@tenant/media/domain/interface/i.media";
import {productEndpointEnum} from "@tenant/product/product/endpoint/product.endpoint";

@Injectable()
export class PatchImageProductApiAdapter extends BaseApiAdapter<RIMedia, [string, FormData]> {

	/**
	 * GET ITEM BY ID
	 * @param productId
	 * @param body
	 */
	public override execute$(productId: string, body: FormData) {
		return this.httpClient.patch<RIMedia>(productEndpointEnum.patchImage, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				productId
			}),
		});
	}

}
