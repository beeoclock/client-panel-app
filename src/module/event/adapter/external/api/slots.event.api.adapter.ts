import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
	providedIn: 'root'
})
export class SlotsEventApiAdapter extends BaseApiAdapter<string[]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object.not.empty])
	public override execute$(params: {
		start: string;
		end: string;
		eventDurationMinutes: number;
		slotIntervalMinutes: number;
	}) {
		return this.httpClient.get<string[]>(eventEndpointEnum.slots, {
			params,
		});
	}

}
