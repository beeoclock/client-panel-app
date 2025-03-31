import {
	SmsUsedAnalyticApi
} from "@tenant/analytic/infrastructure/data-source/api/adapter/sms-used.analytic.api.adapter";

export namespace SmsUsedAnalyticActions {

	// API

	export class GetList {
		public static readonly type = '[Sms Used Analytic API] Get List';
	}

	// Updates of state

	export class UpdateQueryParams {
		public static readonly type = '[Sms Used Analytic State] Update Query Params';

		public constructor(
			public readonly payload: SmsUsedAnalyticApi.IRequestQueryParams,
		) {
		}
	}

}
