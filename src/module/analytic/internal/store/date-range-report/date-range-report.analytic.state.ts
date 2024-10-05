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
import {IntervalTypeEnum} from "@module/analytic/internal/domain/enum/interval.enum";

export type IDateRangeAnalyticState = {
	filterState: {
		interval: IntervalTypeEnum;
		selectedDate: string;
		specialistIds: string[];
	};
	response: DateRangeReportAnalyticApi.IResponse | null;
	analytic: Analytic.I | null;
};

@State<IDateRangeAnalyticState>({
	name: 'dateRangeReportAnalytic',
	defaults: {
		filterState: {
			interval: IntervalTypeEnum.day,
			selectedDate: DateTime.now().toJSDate().toISOString(),
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
			filterState: payload
		})

	}

	@Action(DateRangeReportAnalyticActions.GetList)
	public async getList(ctx: StateContext<IDateRangeAnalyticState>): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const {
				specialistIds,
				selectedDate,
				interval
			} = state.filterState;

			const startDateTime = DateTime.fromISO(selectedDate).startOf(interval).toJSDate().toISOString();
			const endDateTime = DateTime.fromISO(selectedDate).endOf(interval).toJSDate().toISOString();

			const queryParams: DateRangeReportAnalyticApi.IRequestQueryParams = {
				specialistIds,
				startDateTime,
				endDateTime
			}

			// Update current state
			const response = await this.dateRangeReportAnalyticApiAdapter.executeAsync(queryParams);
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
	public static filterState(state: IDateRangeAnalyticState) {
		return state.filterState;
	}

	@Selector()
	public static analytic(state: IDateRangeAnalyticState) {
		return state.analytic;
	}

}
