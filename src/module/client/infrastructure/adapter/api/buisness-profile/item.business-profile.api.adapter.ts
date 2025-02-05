import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Client from "@client/domain";
import {businessProfileEndpointEnum} from "@client/infrastructure/endpoint/business-profile.endpoint";
import {map} from "rxjs";

export namespace ItemBusinessProfileApi {

	type RESPONSE = {
		items: Client.RIClient[];
		totalSize: number;
	};

	@Injectable({
		providedIn: 'root'
	})
	export class Request extends BaseApiAdapter<RESPONSE> {

		// private readonly weekDayTimeZoneHelper = inject(WeekDayTimeZoneHelper);

		public override execute$() {
			return this.httpClient.get(businessProfileEndpointEnum.item).pipe(
				// map((client) => this.weekDayTimeZoneHelper.convertWeekDaysFromUTC(client) as Client.RIClient)
				map((response) => {
					return {
						items: [response],
						totalSize: 1
					} as RESPONSE;
				})
			);
		}

	}

}
