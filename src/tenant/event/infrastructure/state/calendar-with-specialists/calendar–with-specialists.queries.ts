import {createPropertySelectors, Selector} from "@ngxs/store";
import {
	CalendarWithSpecialistsState,
	ICalendarWithSpecialist
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {DateTime} from "luxon";


export class CalendarWithSpecialistsQueries {
	public static state = createPropertySelectors<ICalendarWithSpecialist>(CalendarWithSpecialistsState);

	@Selector([CalendarWithSpecialistsQueries.state.params])
	public static start({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start);
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	public static isToday({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now(), 'day');
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	public static isTomorrow({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now().plus({days: 1}), 'day');
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	public static params(params: ICalendarWithSpecialist['params']) {
		return params;
	}

	@Selector([CalendarWithSpecialistsQueries.state.loader])
	public static loader(loader: ICalendarWithSpecialist['loader']) {
		return loader;
	}

	@Selector([CalendarWithSpecialistsQueries.state.data])
	public static data(data: ICalendarWithSpecialist['data']) {
		return data;
	}

}
