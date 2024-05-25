import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {AbsenceEndpoint} from "@module/absence/external/endpoint/absence.endpoint";
import {IAbsenceDto} from "@module/absence/external/interface/i.absence.dto";

@Injectable({
	providedIn: 'root'
})
export class CreateAbsenceApiAdapter extends BaseApiAdapter<IAbsenceDto, [IAbsenceDto]> {

	/**
	 * @param body
	 */
	public override execute$(body: IAbsenceDto) {

		return this.httpClient.post<IAbsenceDto>(AbsenceEndpoint.CREATE, body);
	}

}
