import {createPropertySelectors, Selector} from "@ngxs/store";
import {
	CalendarWithSpecialistsState,
	ICalendarWithSpecialist
} from "@event/state/calendar-with-specialists/calendar–with-specialists.state";
import {DateTime} from "luxon";

export class CalendarWithSpecialistsQueries {
	static state = createPropertySelectors<ICalendarWithSpecialist>(CalendarWithSpecialistsState);

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static start({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start);
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static isToday({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now(), 'day');
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static isTomorrow({start}: ICalendarWithSpecialist['params']) {
		return DateTime.fromISO(start).hasSame(DateTime.now().plus({days: 1}), 'day');
	}

	@Selector([CalendarWithSpecialistsQueries.state.params])
	static params(params: ICalendarWithSpecialist['params']) {
		return params;
	}

	@Selector([CalendarWithSpecialistsQueries.state.loader])
	static loader(loader: ICalendarWithSpecialist['loader']) {
		return loader;
	}

	@Selector([CalendarWithSpecialistsQueries.state.data])
	static data(data: ICalendarWithSpecialist['data']) {
		return data;
	}

}
