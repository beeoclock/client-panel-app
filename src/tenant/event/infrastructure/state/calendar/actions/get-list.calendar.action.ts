import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@tenant/event/infrastructure/state/calendar/calendar.state";

export class GetListCalendarAction {
	public static readonly type = '[Calendar API] Get List';

	constructor(
		public readonly payload: {
			from: Date;
			to: Date;
		},
	) {
	}

	public static async execute(
		ctx: StateContext<ICalendarState>,
		payload: GetListCalendarAction['payload'],
		// listMergedEventApiAdapter: ListMergedEventApiAdapter,
	) {

		const {from, to} = payload;

		// const {items} = await listMergedEventApiAdapter.executeAsync({
		// 	orderBy: OrderByEnum.START,
		// 	orderDir: OrderDirEnum.ASC,
		// 	page: 1,
		// 	pageSize: 100,
		// 	start: from.toISOString(),
		// 	end: to.toISOString(),
		// });

		const {calendarDataByType} = ctx.getState();

		ctx.patchState({
			calendarDataByType: {
				...calendarDataByType,
				// [from.toISOString()]: items,
			},
		});
	}

}

