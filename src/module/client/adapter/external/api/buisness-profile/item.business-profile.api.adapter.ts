import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Client from "@client/domain";
import {businessProfileEndpointEnum} from "@client/endpoint/business-profile.endpoint";

@Injectable({
	providedIn: 'root'
})
export class ItemBusinessProfileApiAdapter extends BaseApiAdapter<Client.RIClient> {

	// private readonly weekDayTimeZoneHelper = inject(WeekDayTimeZoneHelper);

	public override execute$() {
		return this.httpClient.get<Client.RIClient>(businessProfileEndpointEnum.item).pipe(
			// map((client) => this.weekDayTimeZoneHelper.convertWeekDaysFromUTC(client) as Client.RIClient)
		);
	}

}
