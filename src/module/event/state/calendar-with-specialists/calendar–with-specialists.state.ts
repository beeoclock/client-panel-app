import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DateTime} from "luxon";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import * as Event from "@event/domain";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";

export interface ICalendarWithSpecialist {
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

@State<ICalendarWithSpecialist>({
	name: 'calendarWithSpecialists',
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
export class CalendarWithSpecialistsState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);
	private readonly router = inject(Router);

	@Action(CalendarWithSpecialistsAction.GetItems)
	public async getItems(ctx: StateContext<ICalendarWithSpecialist>) {

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

	@Action(CalendarWithSpecialistsAction.NextDate)
	public async nextDate(ctx: StateContext<ICalendarWithSpecialist>) {

		const {params} = ctx.getState();

		ctx.dispatch(new CalendarWithSpecialistsAction.SetDate({
			date: DateTime.fromISO(params.start).plus({days: 1}).startOf('day').toJSDate().toISOString()
		}));

	}

	@Action(CalendarWithSpecialistsAction.PrevDate)
	public async prevDate(ctx: StateContext<ICalendarWithSpecialist>) {

		const {params} = ctx.getState();

		ctx.dispatch(new CalendarWithSpecialistsAction.SetDate({
			date: DateTime.fromISO(params.start).minus({days: 1}).startOf('day').toJSDate().toISOString()
		}));

	}

	@Action(CalendarWithSpecialistsAction.SetDate)
	public async setDate(ctx: StateContext<ICalendarWithSpecialist>, {payload}: CalendarWithSpecialistsAction.SetDate) {

		const {date} = payload;

		const {params} = ctx.getState();

		// Check if it is a new date
		if (DateTime.fromISO(date).hasSame(DateTime.fromISO(params.start), 'day')) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.setDate', 'Same date', date, params.start);
			ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());
			return;
		}

		ctx.patchState({
			params: {
				...params,
				start: DateTime.fromISO(date).startOf('day').toJSDate().toISOString(),
				end: DateTime.fromISO(date).endOf('day').toJSDate().toISOString(),
			}
		});

		await this.router.navigate([], {
			queryParams: {
				date,
			},
			replaceUrl: true,
		});

		ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());

	}

}
