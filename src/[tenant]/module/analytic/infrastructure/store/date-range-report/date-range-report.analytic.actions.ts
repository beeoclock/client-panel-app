import {
	IDateRangeAnalyticState
} from "@analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";

export namespace DateRangeReportAnalyticActions {

	// API

	export class GetList {
		public static readonly type = '[Date RangeReport Analytic API] Get List';
	}

	// Updates of state

	export class UpdateQueryParams {
		public static readonly type = '[Date RangeReport Analytic State] Update Query Params';

		public constructor(
			public readonly payload: IDateRangeAnalyticState['filterState'],
		) {
		}
	}

}
