import {Injectable} from '@angular/core';
import {memberEndpointEnum} from "@tenant/member/infrastructure/endpoint/member.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IMember} from '@tenant/member/domain/interface/i.member';

@Injectable()
export class GetItemApi extends BaseApiAdapter<IMember.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IMember.DTO>(memberEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
