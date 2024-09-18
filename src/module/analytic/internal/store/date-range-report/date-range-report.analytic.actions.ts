import {DateRangeReportAnalyticApi} from "@module/analytic/external/api/adapter/date-range-report.analytic.api.adapter";

export namespace DateRangeReportAnalyticActions {

	// API

	export class GetList {
		public static readonly type = '[Date RangeReport Analytic API] Get List';
	}

	// Updates of state

	export class UpdateQueryParams {
		public static readonly type = '[Date RangeReport Analytic State] Update Query Params';

		public constructor(
			public readonly payload: DateRangeReportAnalyticApi.IRequestQueryParams,
		) {
		}
	}

}
