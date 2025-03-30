import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {OrderEndpoint} from "@tenant/order/infrastructure/endpoint/order.endpoint";
import {IBusySlot} from "@core/business-logic/order/interface/busy-slot/i.busy-slot";

type TParams = { start: string; end: string; specialist: string | undefined; };

@Injectable({
	providedIn: 'root'
})
export class BusySlotsApiAdapter extends BaseApiAdapter<IBusySlot[], [TParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TParams) {
		return this.httpClient.get<IBusySlot[]>(OrderEndpoint.BUSY_SLOTS, {
			params: params as never,
		});
	}

}
