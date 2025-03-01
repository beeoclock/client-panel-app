import {Injectable} from "@angular/core";
import * as Client from "@core/business-logic/business-profile";
import {DateTime} from "luxon";
import {environment} from "@environment/environment";

@Injectable({
	providedIn: 'root',
})
export class WeekDayTimeZoneHelper {


	/**
	 * @param value
	 * @private
	 */
	public convertWeekDaysToUTC(value: Client.IClient): Client.IClient {
		const timeZoneOffset = DateTime.local().offset;
		value.schedules?.forEach((schedule) => {
			if (schedule?.workDays?.length === 7) {
				return;
			}

			if (timeZoneOffset === 0) {
				return;
			}

			const start = schedule?.startInSeconds ?? 0;
			const end = schedule?.endInSeconds ?? 0;

			if (start < 0) {
				// Yesterday
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				schedule.workDays = schedule?.workDays?.map((day) => {
					if (day === 1) {
						return 7;
					}
					return (day ?? 0) - 1;
				});
				return;
			}

			if (end > environment.constant.SECONDS.ONE_DAY) {
				// Tomorrow
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				schedule.workDays = schedule.workDays?.map((day) => {
					if (day === 7) {
						return 1;
					}
					return (day ?? 0) + 1;
				});
			}
		});
		return value;
	}


	/**
	 * @param value
	 * @private
	 */
	public convertWeekDaysFromUTC(value: Client.IClient): Client.IClient {
		const timeZoneOffset = DateTime.local().offset;
		value.schedules?.forEach((schedule) => {
			if (schedule?.workDays?.length === 7) {
				return;
			}

			if (timeZoneOffset === 0) {
				return;
			}

			const start = schedule?.startInSeconds ?? 0;
			const end = schedule?.endInSeconds ?? 0;

			if (start < 0) {
				// Yesterday
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				schedule.workDays = schedule?.workDays?.map((day) => {
					if (day === 7) {
						return 1;
					}
					return (day ?? 0) + 1;
				});
				return;
			}

			if (end > environment.constant.SECONDS.ONE_DAY) {
				// Tomorrow
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				schedule.workDays = schedule?.workDays?.map((day) => {
					if (day === 1) {
						return 7;
					}
					return (day ?? 0 ) - 1;
				});
			}
		});
		return value;
	}

}
