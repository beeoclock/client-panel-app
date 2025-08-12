import {createPropertySelectors, Selector} from "@ngxs/store";
import {DateTime} from "luxon";
import { IWeekCalendarState, WeekCalendarActionState } from "./week-calendar.state";


export class WeekCalendarQueries {
	public static state = createPropertySelectors<IWeekCalendarState>(WeekCalendarActionState);

	@Selector([WeekCalendarQueries.state.params])
	public static start({start}: IWeekCalendarState['params']) {
		return DateTime.fromISO(start);
	}

	@Selector([WeekCalendarQueries.state.params])
	public static isToday({start}: IWeekCalendarState['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now(), 'day');
	}

	@Selector([WeekCalendarQueries.state.params])
	public static isTomorrow({start}: IWeekCalendarState['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now().plus({days: 1}), 'day');
	}

	@Selector([WeekCalendarQueries.state.params])
	public static params(params: IWeekCalendarState['params']) {
		return params;
	}

	@Selector([WeekCalendarQueries.state.loader])
	public static loader(loader: IWeekCalendarState['loader']) {
		return loader;
	}

	@Selector([WeekCalendarQueries.state.data])
	public static data(data: IWeekCalendarState['data']) {
		return data;
	}

}
