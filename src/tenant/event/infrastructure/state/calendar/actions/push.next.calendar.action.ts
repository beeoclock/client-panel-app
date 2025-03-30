import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@tenant/event/infrastructure/state/calendar/calendar.state";
import {DateTime} from "luxon";
import {GetListCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/get-list.calendar.action";

export class PushNextCalendarAction {
	public static readonly type = '[Calendar State] Push Next';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {calendarDataByType, lastDate, presentationCalendarType, dateRanges} = ctx.getState();
		const pushDateTime = DateTime.fromJSDate(lastDate).plus({[presentationCalendarType]: 1});
		const pushDate = pushDateTime.toJSDate();

		const newData = {
			from: pushDate,
			to: pushDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
		};

		ctx.patchState({
			calendarDataByType: {
				...calendarDataByType,
				[pushDate.toISOString()]: [],
			},
			dateRanges: [
				...dateRanges,
				newData
			],
			lastDate: pushDate,
		});

		ctx.dispatch(new GetListCalendarAction(newData));

	}

}

