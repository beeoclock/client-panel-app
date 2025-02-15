import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absenceEndpointEnum";
import {IAbsence} from "../../../../../core/business-logic/absence/interface/i.absence";

@Injectable({
	providedIn: 'root'
})
export class CreateAbsenceApiAdapter extends BaseApiAdapter<IAbsence, [IAbsence]> {

	/**
	 * @param body
	 */
	public override execute$(body: IAbsence) {

		return this.httpClient.post<IAbsence>(absenceEndpointEnum.CREATE, body);
	}

}
