import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DateTime} from "luxon";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import * as Event from "@event/domain";
import {NGXLogger} from "ngx-logger";
import {StatisticAction} from "@event/state/statistic/statistic.action";

export interface IStatisticState {
	params: {
		start: string;
		end: string;
		page: number;
		pageSize: number;
		orderBy: OrderByEnum;
		orderDir: OrderDirEnum;
	};
	data: ResponseListType<Event.RIEvent>;
	loader: boolean;
}

@State<IStatisticState>({
	name: 'statistic',
	defaults: {
		params: {
			start: DateTime.now().startOf('day').toJSDate().toISOString(),
			end: DateTime.now().endOf('day').toJSDate().toISOString(),
			page: 1,
			pageSize: 1000,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		},
		data: {
			items: [],
			totalSize: 0,
		},
		loader: false,
	},
})
@Injectable()
export class StatisticState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);

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

		this.listMergedEventApiAdapter.executeAsync(params).then((data) => {

			ctx.patchState({
				loader: false,
				data,
			})

		}).catch((error) => {

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

}
