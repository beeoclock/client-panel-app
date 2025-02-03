import {DailyReportAnalyticApi} from "@analytic/external/api/adapter/daily-report.analytic.api.adapter";

export namespace DailyReportAnalyticActions {

	// API

	export class GetList {
		public static readonly type = '[Daily Report Analytic API] Get List';
	}

	// Updates of state

	export class UpdateQueryParams {
		public static readonly type = '[Daily Report Analytic State] Update Query Params';

		public constructor(
			public readonly payload: DailyReportAnalyticApi.IRequestQueryParams,
		) {
		}
	}

}
