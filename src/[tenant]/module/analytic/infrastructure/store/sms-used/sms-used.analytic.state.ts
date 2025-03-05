import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {SmsUsedAnalyticApi} from "@analytic/infrastructure/api/adapter/sms-used.analytic.api.adapter";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@utility/state/app/app.actions";
import {DateTime} from "luxon";
import {SmsUsedAnalyticActions} from "@analytic/infrastructure/store/sms-used/sms-used.analytic.actions";

export type ISmsUsedAnalytic = {
	queryParams: SmsUsedAnalyticApi.IRequestQueryParams;
	response: SmsUsedAnalyticApi.IResponse | null;
};

@State<ISmsUsedAnalytic>({
	name: 'smsUsedAnalytic',
	defaults: {
		queryParams: {
			startDate: DateTime.now().minus({
				days: 7
			}).toJSDate().toISOString(),
			endDate: DateTime.now().toJSDate().toISOString(),
		},
		response: null,
	},
})
@Injectable()
export class SmsUsedAnalyticState {

	private readonly smsUsedAnalyticApiAdapter = inject(SmsUsedAnalyticApi.Adapter);
	private readonly ngxLogger = inject(NGXLogger);

	// API

	@Action(SmsUsedAnalyticActions.UpdateQueryParams)
	public UpdateQueryParams(ctx: StateContext<ISmsUsedAnalytic>, {payload}: SmsUsedAnalyticActions.UpdateQueryParams) {

		ctx.patchState({
			queryParams: payload
		})

	}

	@Action(SmsUsedAnalyticActions.GetList)
	public async getList(ctx: StateContext<ISmsUsedAnalytic>): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			// Update current state
			const response = await this.smsUsedAnalyticApiAdapter.executeAsync(state.queryParams);

			this.ngxLogger.debug('SmsUsedAnalyticActions.GetList ', response);

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
	public static response(state: ISmsUsedAnalytic) {
		return state.response;
	}

	@Selector()
	public static queryParams(state: ISmsUsedAnalytic) {
		return state.queryParams;
	}

}
