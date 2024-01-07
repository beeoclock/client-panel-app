import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@event/state/calendar/calendar.state";
import {DateTime} from "luxon";

export class PushPrevCalendarAction {
	public static readonly type = '[Calendar State] Push Prev';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {calendarDataByType, firstDate, presentationCalendarType, dateRanges} = ctx.getState();
		const prevDateTime = DateTime.fromJSDate(firstDate).minus({[presentationCalendarType]: 1});
		const prevDate = prevDateTime.toJSDate();

		ctx.patchState({
			calendarDataByType: {
				...calendarDataByType,
				[prevDate.toISOString()]: [],
			},
			dateRanges: [
				{
					from: prevDate,
					to: prevDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
				},
				...dateRanges,
			],
			firstDate: prevDate,
		});

	}

}

