// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CalendarWithSpecialistsAction {
	export class GetItems {
		static readonly type = '[CalendarWithSpecialists] Get Items';
	}

	export class SetDate {
		static readonly type = '[CalendarWithSpecialists] Set Date';

		constructor(public readonly payload: {
			start: string;
		}) {
		}
	}

	export class NextDate {
		static readonly type = '[CalendarWithSpecialists] Next Date';
	}

	export class PrevDate {
		static readonly type = '[CalendarWithSpecialists] Prev Date';
	}

	export class UpdateFilters {
		static readonly type = '[CalendarWithSpecialists] Update Filters';

		constructor(public readonly payload: {
			[key: string]: undefined | unknown;
		}) {
		}
	}
}
