import {createPropertySelectors, Selector} from "@ngxs/store";
import {CalendarState, ICalendarState} from "@event/presentation/state/calendar/calendar.state";
import {PresentationCalendarType} from "@event/domain/enum/presentation-calendar-type.enum";

export class CalendarQueries {
	static calendarStore = createPropertySelectors<ICalendarState>(CalendarState);

	@Selector([CalendarQueries.calendarStore.calendarDataByType])
	static dataByType(data: ICalendarState['calendarDataByType']) {
		return data;
	}

	@Selector([CalendarQueries.calendarStore.presentationCalendarType])
	static presentationType(type: PresentationCalendarType) {
		return type;
	}

	@Selector([CalendarQueries.calendarStore.currentDate])
	static currentDate(date: Date) {
		return date;
	}

	@Selector([CalendarQueries.calendarStore.dateRanges])
	static dateRanges(dateRanges: ICalendarState['dateRanges']) {
		return dateRanges;
	}

	@Selector([CalendarQueries.calendarStore.firstDate])
	static firstDate(firstDate: ICalendarState['firstDate']) {
		return firstDate;
	}

	@Selector([CalendarQueries.calendarStore.lastDate])
	static lastDate(lastDate: ICalendarState['lastDate']) {
		return lastDate;
	}
}
