import { IntervalTypeEnum } from "@src/tenant/analytic/domain/enum/interval.enum";

export namespace WeekCalendarAction {
	export class GetItems {
		public static readonly type = '[WeekCalendar] Get Items';
	}

	export class SetDate {
		public static readonly type = '[WeekCalendar] Set Date';

		public constructor(public readonly payload: {
			start: string;
			interval: IntervalTypeEnum;
		}) {
		}
	}

	export class NextDate {
		public static readonly type = '[WeekCalendar] Next Date';
	}

	export class PrevDate {
		public static readonly type = '[WeekCalendar] Prev Date';
	}

	export class UpdateFilters {
		public static readonly type = '[WeekCalendar] Update Filters';

		public constructor(public readonly payload: {
			[key: string]: undefined | unknown;
		}) {
		}
	}
}
