import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

type PARAMS = {
	start: string;
	end: string;
	eventDurationInSeconds: number;
	slotIntervalInSeconds: number;
	specialist: string;
};

@Injectable({
	providedIn: 'root'
})
export class SlotsEventApiAdapter extends BaseApiAdapter<string[], [PARAMS]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: PARAMS) {
		return this.httpClient.get<string[]>(eventEndpointEnum.slots, {
			params,
		});
	}

}
