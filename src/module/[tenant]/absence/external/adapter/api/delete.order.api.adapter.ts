import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {AbsenceEndpoint} from "@absence/external/endpoint/absence.endpoint";

@Injectable({
	providedIn: 'root'
})
export class DeleteAbsenceApiAdapter extends BaseApiAdapter<void, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.delete<void>(AbsenceEndpoint.DELETE, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
