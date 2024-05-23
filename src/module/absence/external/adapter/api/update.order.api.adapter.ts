import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IAbsenceDto, IUpdateAbsenceDto} from "@module/absence/external/interface/i.absence.dto";
import {AbsenceEndpoint} from "@module/absence/external/endpoint/absence.endpoint";

@Injectable({
	providedIn: 'root'
})
export class UpdateAbsenceApiAdapter extends BaseApiAdapter<IAbsenceDto, [string, IUpdateAbsenceDto]> {

	/**
	 * @param id
	 * @param body
	 */
	public override execute$(id: string, body: IUpdateAbsenceDto) {
		return this.httpClient.put<IAbsenceDto>(AbsenceEndpoint.UPDATE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {id})
		});
	}

}
