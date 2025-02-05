import {Injectable} from '@angular/core';
import * as Client from '@client/domain';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {businessProfileEndpointEnum} from "@client/infrastructure/endpoint/business-profile.endpoint";

@Injectable({
	providedIn: 'root'
})
export class UpdateBusinessProfileApiAdapter extends BaseApiAdapter<Client.RIClient, [Client.IClient]> {

	// private readonly weekDayTimeZoneHelper = inject(WeekDayTimeZoneHelper);

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: Client.IClient) {
		// value = this.weekDayTimeZoneHelper.convertWeekDaysToUTC(value);
		return this.httpClient.put<Client.RIClient>(businessProfileEndpointEnum.update, value);
	}

}
