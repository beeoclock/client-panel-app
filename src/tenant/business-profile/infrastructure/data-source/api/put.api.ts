import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {businessProfileEndpointEnum} from "@tenant/business-profile/infrastructure/endpoint/business-profile.endpoint";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";

@Injectable()
export class PutApi extends BaseApiAdapter<IBusinessProfile.DTO, [IBusinessProfile.DTO]> {

	// private readonly weekDayTimeZoneHelper = inject(WeekDayTimeZoneHelper);

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IBusinessProfile.DTO) {
		// value = this.weekDayTimeZoneHelper.convertWeekDaysToUTC(value);
		return this.httpClient.put<IBusinessProfile.DTO>(businessProfileEndpointEnum.update, value);
	}

}
