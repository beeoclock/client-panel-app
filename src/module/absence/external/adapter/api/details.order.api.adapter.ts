import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {AbsenceEndpoint} from "@module/absence/external/endpoint/absence.endpoint";
import {IAbsenceDto} from "@module/absence/external/interface/i.absence.dto";

@Injectable({
	providedIn: 'root'
})
export class DetailsAbsenceApiAdapter extends BaseApiAdapter<IAbsenceDto, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IAbsenceDto>(AbsenceEndpoint.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
