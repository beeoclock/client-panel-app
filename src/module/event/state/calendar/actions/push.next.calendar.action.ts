import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@event/state/calendar/calendar.state";
import {DateTime} from "luxon";

export class PushNextCalendarAction {
	public static readonly type = '[Calendar State] Push Next';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {calendarDataByType, lastDate, presentationCalendarType, dateRanges} = ctx.getState();
		const pushDateTime = DateTime.fromJSDate(lastDate).plus({[presentationCalendarType]: 1});
		const pushDate = pushDateTime.toJSDate();

		ctx.patchState({
			calendarDataByType: {
				...calendarDataByType,
				[pushDate.toISOString()]: [],
			},
			dateRanges: [
				...dateRanges,
				{
					from: pushDate,
					to: pushDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
				}
			],
			lastDate: pushDate,
		});

	}

}

