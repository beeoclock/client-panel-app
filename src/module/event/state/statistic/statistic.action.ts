export namespace StatisticAction {
	export class GetItems {
		static readonly type = '[Event Statistic] Get Items';
	}

	export class SetDate {
		static readonly type = '[Event Statistic] Set Date';

		constructor(public readonly payload: {
			start: string;
			end: string;
		}) {
		}
	}

	export class NextDate {
		static readonly type = '[Event Statistic] Next Date';
	}

	export class PrevDate {
		static readonly type = '[Event Statistic] Prev Date';
	}

	export class Calculate {
		static readonly type = '[Event Statistic] Calculate';
	}
}
