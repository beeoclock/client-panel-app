import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IAbsence} from "../../../../../core/business-logic/absence/interface/i.absence";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absenceEndpointEnum";

@Injectable({
	providedIn: 'root'
})
export class UpdateAbsenceApiAdapter extends BaseApiAdapter<IAbsence.DTO, [IAbsence.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IAbsence.DTO) {
		return this.httpClient.put<IAbsence.DTO>(absenceEndpointEnum.UPDATE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: body._id
			})
		});
	}

}
