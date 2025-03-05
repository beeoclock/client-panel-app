import {StateContext} from "@ngxs/store";
import {ICalendarState} from "@event/infrastructure/state/calendar/calendar.state";
import {GetListCalendarAction} from "@event/infrastructure/state/calendar/actions/get-list.calendar.action";

export class RefreshCalendarAction {
	public static readonly type = '[Calendar State] Refresh';

	public static async execute(ctx: StateContext<ICalendarState>) {

		const {dateRanges} = ctx.getState();
		for (const dateRange of dateRanges) {
			ctx.dispatch(new GetListCalendarAction(dateRange));
		}

	}

}

