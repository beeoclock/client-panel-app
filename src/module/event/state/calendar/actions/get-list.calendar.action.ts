import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@event/state/calendar/calendar.state";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";

export class GetListCalendarAction {
	public static readonly type = '[Calendar API] Get List';

	public static async execute(
		ctx: StateContext<ICalendarState>,
		listMergedEventApiAdapter: ListMergedEventApiAdapter,
	) {

		const {calendarDataByType, dateRanges} = ctx.getState();

		const requests = await Promise.all(
			dateRanges.map(
				async (dateRange) => {
					const {items} = await listMergedEventApiAdapter.executeAsync({
						orderBy: OrderByEnum.START,
						orderDir: OrderDirEnum.ASC,
						page: 1,
						pageSize: 100,
						start: dateRange.from.toISOString(),
						end: dateRange.to.toISOString(),
					});
					return {
						[dateRange.from.toISOString()]: items,
					};
				}
			)
		);

		ctx.patchState({
			calendarDataByType: {
				...calendarDataByType,
				...requests.reduce((acc, request) => ({...acc, ...request}), {}),
			},
		});
	}

}

