import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@tenant/event/presentation/state/calendar/calendar.state";
import {DateTime} from "luxon";
import {GetListCalendarAction} from "@tenant/event/presentation/state/calendar/actions/get-list.calendar.action";

export class InitCalendarAction {
	public static readonly type = '[Calendar State] Init';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {currentDate, presentationCalendarType} = ctx.getState();
		const currentDateTime = DateTime.fromJSDate(currentDate);
		const prevDateTime = currentDateTime.minus({[presentationCalendarType]: 1});
		const nextDateTime = currentDateTime.plus({[presentationCalendarType]: 1});

		const firstData = {
			from: prevDateTime.toJSDate(),
			to: prevDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
		};

		const currentData = {
			from: currentDateTime.toJSDate(),
			to: currentDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
		};

		const lastData = {
			from: nextDateTime.toJSDate(),
			to: nextDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
		};

		ctx.setState({
			calendarDataByType: {
				[prevDateTime.toJSDate().toISOString()]: [],
				[currentDate.toISOString()]: [],
				[nextDateTime.toJSDate().toISOString()]: [],
			},
			dateRanges: [
				firstData,
				currentData,
				lastData
			],
			firstDate: prevDateTime.toJSDate(),
			lastDate: nextDateTime.toJSDate(),
			currentDate: currentDateTime.toJSDate(),
			presentationCalendarType,
		});

		ctx.dispatch(new GetListCalendarAction(firstData));
		ctx.dispatch(new GetListCalendarAction(currentData));
		ctx.dispatch(new GetListCalendarAction(lastData));

	}

}

