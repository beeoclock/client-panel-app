import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@event/state/calendar/calendar.state";
import {GetListCalendarAction} from "@event/state/calendar/actions/get-list.calendar.action";

export class RefreshCalendarAction {
	public static readonly type = '[Calendar State] Refresh';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {dateRanges} = ctx.getState();
		for (const dateRange of dateRanges) {
			ctx.dispatch(new GetListCalendarAction(dateRange));
		}

	}

}

