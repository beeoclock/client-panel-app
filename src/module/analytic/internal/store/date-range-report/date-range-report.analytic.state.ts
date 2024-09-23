import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {DateRangeReportAnalyticApi} from "@module/analytic/external/api/adapter/date-range-report.analytic.api.adapter";
import {
	DateRangeReportAnalyticActions
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.actions";
import {DateTime} from "luxon";
import {
	transformIResponseToAnalytic
} from "@module/analytic/internal/domain/tool/calculate.date-range-report.analytic.tool";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";

export type IDateRangeAnalyticState = {
	queryParams: DateRangeReportAnalyticApi.IRequestQueryParams;
	response: DateRangeReportAnalyticApi.IResponse | null;
	analytic: Analytic.I | null;
};

@State<IDateRangeAnalyticState>({
	name: 'dateRangeReportAnalytic',
	defaults: {
		queryParams: {
			startDate: DateTime.now().startOf('day').toJSDate().toISOString(),
			endDate: DateTime.now().toJSDate().toISOString(),
			specialistIds: [] as string[],
		},
		response: null,
		analytic: null,
	},
})
@Injectable()
export class DateRangeReportAnalyticState {

	protected readonly dateRangeReportAnalyticApiAdapter = inject(DateRangeReportAnalyticApi.Adapter);
	private readonly ngxLogger = inject(NGXLogger);

	// API

	@Action(DateRangeReportAnalyticActions.UpdateQueryParams)
	public UpdateQueryParams(ctx: StateContext<IDateRangeAnalyticState>, {payload}: DateRangeReportAnalyticActions.UpdateQueryParams) {

		ctx.patchState({
			queryParams: payload
		})

	}

	@Action(DateRangeReportAnalyticActions.GetList)
	public async getList(ctx: StateContext<IDateRangeAnalyticState>): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			// Update current state
			const response = await this.dateRangeReportAnalyticApiAdapter.executeAsync(state.queryParams);
			const analytic = transformIResponseToAnalytic(response);

			this.ngxLogger.debug('DateRangeReportAnalyticActions.GetList ', response, analytic);

			ctx.patchState({
				response,
				analytic
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	// Selectors

	@Selector()
	public static response(state: IDateRangeAnalyticState) {
		return state.response;
	}

	@Selector()
	public static queryParams(state: IDateRangeAnalyticState) {
		return state.queryParams;
	}

	@Selector()
	public static analytic(state: IDateRangeAnalyticState) {
		return state.analytic;
	}

}
