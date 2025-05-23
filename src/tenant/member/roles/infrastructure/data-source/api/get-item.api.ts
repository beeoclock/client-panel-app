import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IRole} from "@tenant/member/roles/domain";
import {roleEndpointEnum} from "@tenant/member/roles/infrastructure/endpoint/role.endpoint";

@Injectable()
export class GetItemApi extends BaseApiAdapter<IRole.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IRole.DTO>(roleEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
