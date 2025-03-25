import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {absenceEndpointEnum} from "@[tenant]/absence/infrastructure/endpoint/absence.endpoint";

@Injectable()
export class PutApi extends BaseApiAdapter<IAbsence.DTO, [IAbsence.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IAbsence.DTO) {
		return this.httpClient.put<IAbsence.DTO>(absenceEndpointEnum.PUT, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: body._id
			})
		});
	}

}
