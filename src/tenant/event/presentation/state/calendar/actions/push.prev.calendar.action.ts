import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@tenant/event/presentation/state/calendar/calendar.state";
import {DateTime} from "luxon";
import {GetListCalendarAction} from "@tenant/event/presentation/state/calendar/actions/get-list.calendar.action";

export class PushPrevCalendarAction {
	public static readonly type = '[Calendar State] Push Prev';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {calendarDataByType, firstDate, presentationCalendarType, dateRanges} = ctx.getState();
		const prevDateTime = DateTime.fromJSDate(firstDate).minus({[presentationCalendarType]: 1});
		const prevDate = prevDateTime.toJSDate();

		const newData = {
			from: prevDate,
			to: prevDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
		};
		ctx.patchState({
			calendarDataByType: {
				...calendarDataByType,
				[prevDate.toISOString()]: [],
			},
			dateRanges: [
				newData,
				...dateRanges,
			],
			firstDate: prevDate,
		});

		ctx.dispatch(new GetListCalendarAction(newData));

	}

}

