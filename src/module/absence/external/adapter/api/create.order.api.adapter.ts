import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {AbsenceEndpoint} from "@module/absence/external/endpoint/absence.endpoint";
import {IAbsenceDto, ICreateAbsenceDto} from "@module/absence/external/interface/i.absence.dto";

@Injectable({
	providedIn: 'root'
})
export class CreateAbsenceApiAdapter extends BaseApiAdapter<IAbsenceDto, [ICreateAbsenceDto]> {

	/**
	 * @param body
	 */
	public override execute$(body: ICreateAbsenceDto) {

		return this.httpClient.post<IAbsenceDto>(AbsenceEndpoint.CREATE, body);
	}

}
