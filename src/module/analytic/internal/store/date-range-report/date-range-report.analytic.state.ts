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
import {Types} from "@utility/types";
import {
	calculateDateRangeReportAnalyticTool
} from "@module/analytic/internal/domain/tool/calculate.date-range-report.analytic.tool";

export type IDateRangeAnalyticState = {
	queryParams: DateRangeReportAnalyticApi.IRequestQueryParams;
	response: DateRangeReportAnalyticApi.IResponse | null;
	analytic: {
		summary: {
			income: number;
			totalOrders: number;
			averageBill: number;
			averageServiceTime: number; // In seconds
			totalServiceTime: number; // In seconds
			uniqueClients: number; // Only if client has _id
			appointments: {
				total: number;
				by: {
					panel: {
						total: number;
						percentages: number;
					};
					client: {
						total: number;
						percentages: number;
					};
				};
			};
		};
		counter: {
			by: {
				specialist: {
					[specialistId: string & Types.ObjectId]: {
						income: number;
						uniqueClients: number;
						averageBill: number;
						averageServiceTime: number; // In seconds
						totalServiceTime: number; // In seconds
						appointments: {
							total: number;
							by: {
								panel: {
									total: number;
									percentages: number;
								};
								client: {
									total: number;
									percentages: number;
								};
							};
						};
						uniqueClient: {
							/**
							 * Це дані про те який саме з спеціаліста клієнтів був чи балі і як часто або скільки залишив грошей
							 */
							[clientId: string & Types.ObjectId]: {
								appointments: {
									total: number;
									by: {
										panel: number;
										client: number;
									};
								};
								order: {
									service: {
										[serviceId: string & Types.ObjectId]: {
											appointments: {
												total: number;
												by: {
													panel: number;
													client: number;
												};
											};
											expenses: number;
										};
									};
								};
								expenses: number;
							};
						};
					};
				};
				calendar: {
					[date: string & Types.Date]: {
						uniqueClients: number;
						appointments: {
							total: number;
							by: {
								panel: number;
								client: number;
							};
						};
						income: number;
					};
				};
				month: {
					[month: string & Types.YearMonth]: {
						uniqueClients: number;
						appointments: {
							total: number;
							by: {
								panel: number;
								client: number;
							};
						};
						income: number;
					};
				};
				weekDay: {
					[week: number]: {
						uniqueClients: number;
						appointments: {
							total: number;
							percentages: number;
							by: {
								panel: {
									total: number;
									percentages: number;
								};
								client: {
									total: number;
									percentages: number;
								};
							};
						};
						income: number;
					};
				};
				hour: {
					[hour: string & Types.Time]: { // 00:00
						uniqueClients: number;
						appointments: {
							total: number;
							by: {
								panel: number;
								client: number;
							};
						};
						income: number;
					};
				};
				service: {
					[serviceId: string & Types.ObjectId]: {
						uniqueClients: number;
						appointments: {
							total: number;
							by: {
								panel: number;
								client: number;
							};
						};
						income: number;
					};
				};
				customer: {
					[customerId: string & Types.ObjectId]: {
						appointments: {
							total: number;
							by: {
								panel: number;
								client: number;
							};
						};
						order: {
							service: {
								[serviceId: string & Types.ObjectId]: {
									appointments: {
										total: number;
										by: {
											panel: number;
											client: number;
										};
									};
									expenses: number;
								};
							};
						};
						expenses: number;
					};
				};
			};
		};
		specialist: {
			[specialistId: string & Types.ObjectId]: DateRangeReportAnalyticApi.ISpecialist;
		};
		service: {
			[serviceId: string & Types.ObjectId]: DateRangeReportAnalyticApi.IService;
		};
		customer: {
			[customerId: string & Types.ObjectId]: DateRangeReportAnalyticApi.IAttendee;
		};
	} | null;
};

@State<IDateRangeAnalyticState>({
	name: 'dateRangeReportAnalytic',
	defaults: {
		queryParams: {
			startDate: DateTime.now().minus({
				year: 1
			}).toJSDate().toISOString(),
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
			const analytic = calculateDateRangeReportAnalyticTool(response);

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
