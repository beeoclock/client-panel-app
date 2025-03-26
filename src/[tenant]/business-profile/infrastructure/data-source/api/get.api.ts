import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {
	businessProfileEndpointEnum
} from "@[tenant]/business-profile/infrastructure/endpoint/business-profile.endpoint";
import {map} from "rxjs";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";

export namespace GetApi {

	type RESPONSE = ResponseListType<IBusinessProfile.DTO>;

	@Injectable()
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
