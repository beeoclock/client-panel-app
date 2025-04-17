import {Injectable} from '@angular/core';
import {memberEndpointEnum} from "@tenant/member/member/infrastructure/endpoint/member.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IMember} from "@tenant/member/member/domain/interface/i.member";

@Injectable()
export class PutApi extends BaseApiAdapter<IMember.DTO, [IMember.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IMember.DTO) {
		return this.httpClient.put<IMember.DTO>(memberEndpointEnum.update, value, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: value._id,
			}),
		});
	}

}
