import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import * as Event from "@event/domain";
import {TableState_BackendFormat} from "@utility/domain/table.state";

@Injectable({
	providedIn: 'root'
})
export class ListEventApiAdapter extends BaseApiAdapter<ResponseListType<Event.RIEvent>> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseListType<Event.RIEvent>>(eventEndpointEnum.paged, {
			params: params as never,
		});
	}

}
