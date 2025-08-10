import { IntervalTypeEnum } from "@src/tenant/analytic/domain/enum/interval.enum";

export namespace WeekCalendarAction {
	export class GetItems {
		static readonly type = '[WeekCalendar] Get Items';
	}

	export class SetDate {
		static readonly type = '[WeekCalendar] Set Date';

		constructor(public readonly payload: {
			start: string;
			interval: IntervalTypeEnum;
		}) {
		}
	}

	export class NextDate {
		static readonly type = '[WeekCalendar] Next Date';
	}

	export class PrevDate {
		static readonly type = '[WeekCalendar] Prev Date';
	}

	export class UpdateFilters {
		static readonly type = '[WeekCalendar] Update Filters';

		constructor(public readonly payload: {
			[key: string]: undefined | unknown;
		}) {
		}
	}
}
