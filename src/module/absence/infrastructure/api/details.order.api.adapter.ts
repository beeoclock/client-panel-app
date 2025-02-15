import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absenceEndpointEnum";
import {IAbsence} from "../../../../../core/business-logic/absence/interface/i.absence";

@Injectable({
	providedIn: 'root'
})
export class DetailsAbsenceApiAdapter extends BaseApiAdapter<IAbsence, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IAbsence>(absenceEndpointEnum.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
