import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {DailyReportAnalyticApi} from "@module/analytic/external/api/adapter/daily-report.analytic.api.adapter";
import {DailyReportAnalyticActions} from "@module/analytic/internal/store/daily-report/daily-report.analytic.actions";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {NGXLogger} from "ngx-logger";
import {DateTime} from "luxon";

export type IDailyReportAnalytic = {
	queryParams: DailyReportAnalyticApi.IRequestQueryParams;
	response: DailyReportAnalyticApi.IResponse | null;
};


@State<IDailyReportAnalytic>({
	name: 'dailyReportAnalytic',
	defaults: {
		queryParams: {
			date: DateTime.now().toJSDate().toISOString(),
			specialistIds: [] as string[],
		},
		response: null,
	}
})
@Injectable()
export class DailyReportAnalyticState {

	private readonly dailyReportAnalyticApiAdapter = inject(DailyReportAnalyticApi.Adapter);
	private readonly ngxLogger = inject(NGXLogger);

	// API

	@Action(DailyReportAnalyticActions.UpdateQueryParams)
	public UpdateQueryParams(ctx: StateContext<IDailyReportAnalytic>, {payload}: DailyReportAnalyticActions.UpdateQueryParams) {

		ctx.patchState({
			queryParams: payload
		})

	}

	@Action(DailyReportAnalyticActions.GetList)
	public async getList(ctx: StateContext<IDailyReportAnalytic>): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			// Update current state
			const response = await this.dailyReportAnalyticApiAdapter.executeAsync(state.queryParams);

			this.ngxLogger.debug('DailyReportAnalyticActions.GetList ', response);

			ctx.patchState({
				response
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	// Selectors

	@Selector()
	public static response(state: IDailyReportAnalytic) {
		return state.response;
	}

	@Selector()
	public static queryParams(state: IDailyReportAnalytic) {
		return state.queryParams;
	}

}
