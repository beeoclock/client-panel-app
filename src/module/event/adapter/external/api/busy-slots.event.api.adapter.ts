import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {IBusySlot} from "@order/external/interface/busy-slot/i.busy-slot";

type TParams = { start: string; end: string; specialist: string | undefined; };

@Injectable({
	providedIn: 'root'
})
export class BusySlotsEventApiAdapter extends BaseApiAdapter<IBusySlot[], [TParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TParams) {
		return this.httpClient.get<IBusySlot[]>(eventEndpointEnum.busySlots, {
			params: params as never,
		});
	}

}
