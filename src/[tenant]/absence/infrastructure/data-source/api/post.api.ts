import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {absenceEndpointEnum} from "@[tenant]/absence/infrastructure/endpoint/absence.endpoint";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

@Injectable()
export class PostApi extends BaseApiAdapter<IAbsence.DTO, [IAbsence.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IAbsence.DTO) {

		return this.httpClient.post<IAbsence.DTO>(absenceEndpointEnum.POST, body);
	}

}
