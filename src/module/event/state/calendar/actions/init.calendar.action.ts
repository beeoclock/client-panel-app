import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@event/state/calendar/calendar.state";

export class InitCalendarAction {
	public static readonly type = '[Calendar State] Init';

	public static async execute(ctx: StateContext<ICalendarState>) {
		console.log('InitCalendarAction');
	}

}

