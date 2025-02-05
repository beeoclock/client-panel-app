import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DateTime} from "luxon";
import {NGXLogger} from "ngx-logger";
import {StatisticAction} from "@event/state/statistic/statistic.action";
import {PagedOrderApiAdapter} from "@order/infrastructure/api/paged.order.api.adapter";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import {IOrderDto} from "@order/domain/interface/details/i.order.dto";
import {initStatisticCalculator, statisticCalculator} from "@event/state/statistic/statistic.calculator";

export interface IStatisticState {
	params: {
		start: string;
		end: string;
		page: number;
		pageSize: number;
		statuses: OrderStatusEnum[];
		orderBy: OrderByEnum;
		orderDir: OrderDirEnum;
	};
	data: ResponseListType<IOrderDto>;
	calculated: ReturnType<typeof statisticCalculator>;
	loader: boolean;
}

@State<IStatisticState>({
	name: 'statistic',
	defaults: {
		params: {
			start: DateTime.now().startOf('day').toJSDate().toISOString(),
			end: DateTime.now().endOf('day').toJSDate().toISOString(),
			statuses: [OrderStatusEnum.done],
			page: 1,
			pageSize: 1000,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		},
		data: {
			items: [],
			totalSize: 0,
		},
		calculated: initStatisticCalculator(),
		loader: false,
	},
})
@Injectable()
export class StatisticState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly pagedOrderApiAdapter = inject(PagedOrderApiAdapter);

	@Action(StatisticAction.GetItems)
	public async getItems(ctx: StateContext<IStatisticState>) {

		const {params, loader} = ctx.getState();

		if (loader) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.getItems', 'Loader is already active', params);
			return;
		}

		ctx.patchState({
			loader: true,
		});

		this.pagedOrderApiAdapter.executeAsync(params)
			.then((data) => {

				ctx.patchState({
					data,
					loader: false,
				});

				ctx.dispatch(new StatisticAction.Calculate())

			})
			.catch((error) => {

				this.ngxLogger.error('CalendarWithSpecialistsState.getItems', error);

				ctx.patchState({
					loader: false,
				});

			});

	}

	@Action(StatisticAction.NextDate)
	public async nextDate(ctx: StateContext<IStatisticState>) {

		const {params} = ctx.getState();

		ctx.dispatch(new StatisticAction.SetDate({
			start: DateTime.fromISO(params.start).plus({days: 1}).startOf('day').toJSDate().toISOString(),
			end: DateTime.fromISO(params.start).plus({days: 1}).startOf('day').toJSDate().toISOString()
		}));

	}

	@Action(StatisticAction.PrevDate)
	public async prevDate(ctx: StateContext<IStatisticState>) {

		const {params} = ctx.getState();

		ctx.dispatch(new StatisticAction.SetDate({
			start: DateTime.fromISO(params.start).minus({days: 1}).startOf('day').toJSDate().toISOString(),
			end: DateTime.fromISO(params.start).minus({days: 1}).startOf('day').toJSDate().toISOString(),
		}));

	}

	@Action(StatisticAction.SetDate)
	public async setDate(ctx: StateContext<IStatisticState>, {payload}: StatisticAction.SetDate) {

		const {start, end} = payload;

		const {params} = ctx.getState();

		// Check if it is a new date
		if (DateTime.fromISO(start).hasSame(DateTime.fromISO(params.start), 'day')) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.setDate', 'Same date', start, params.start);
			ctx.dispatch(new StatisticAction.GetItems());
			return;
		}

		ctx.patchState({
			params: {
				...params,
				start,
				end,
			}
		});

		ctx.dispatch(new StatisticAction.GetItems());

	}

	@Action(StatisticAction.Calculate)
	public calculate(ctx: StateContext<IStatisticState>) {
		const {data} = ctx.getState();
		ctx.patchState({
			calculated: statisticCalculator(data),
		})
	}

}
