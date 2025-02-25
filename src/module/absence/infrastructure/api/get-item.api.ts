import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absence.endpoint";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";


@Injectable()
export class GetItemApi extends BaseApiAdapter<IAbsence.DTO, [string]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.get<IAbsence.DTO>(absenceEndpointEnum.GET_ITEM, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}

}
