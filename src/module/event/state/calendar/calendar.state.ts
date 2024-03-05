import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {DateTime} from "luxon";
import {
	DEFAULT_PRESENTATION_CALENDAR_TYPE,
	PresentationCalendarType
} from "@event/domain/enum/presentation-calendar-type.enum";
import {PushNextCalendarAction} from "@event/state/calendar/actions/push.next.calendar.action";
import {PushPrevCalendarAction} from "@event/state/calendar/actions/push.prev.calendar.action";
import {GetListCalendarAction} from "@event/state/calendar/actions/get-list.calendar.action";
import {ListMergedEventApiAdapter} from "@event/adapter/external/api/list.merged.event.api.adapter";
import {IEvent} from "@event/domain";
import {InitCalendarAction} from "@event/state/calendar/actions/init.calendar.action";
import {RefreshCalendarAction} from "@event/state/calendar/actions/refresh.calendar.action";

export interface ICalendarState {
	calendarDataByType: {[key: string]: IEvent[]}; // key - ISO, value - events
	currentDate: Date;
	presentationCalendarType: PresentationCalendarType;
	dateRanges: {
		from: Date;
		to: Date;
	}[];
	firstDate: Date;
	lastDate: Date;
}

@State<ICalendarState>({
	name: 'calendar',
	defaults: {
		calendarDataByType: {}, // key - week number, value - events
		currentDate: DateTime.local().startOf(DEFAULT_PRESENTATION_CALENDAR_TYPE).toJSDate(),
		presentationCalendarType: DEFAULT_PRESENTATION_CALENDAR_TYPE,
		dateRanges: [],
		firstDate: DateTime.local().startOf(DEFAULT_PRESENTATION_CALENDAR_TYPE).toJSDate(),
		lastDate: DateTime.local().startOf(DEFAULT_PRESENTATION_CALENDAR_TYPE).toJSDate(),
	},
})
@Injectable()
export class CalendarState {

	private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);

	@Action(GetListCalendarAction)
	public async getListCalendarAction(ctx: StateContext<ICalendarState>, action: GetListCalendarAction) {
		await GetListCalendarAction.execute(ctx, action.payload, this.listMergedEventApiAdapter);
	}

	@Action(InitCalendarAction)
	public async initCalendarAction(ctx: StateContext<ICalendarState>) {
		await InitCalendarAction.execute(ctx);
	}

	@Action(PushNextCalendarAction)
	public async pushNextCalendarAction(ctx: StateContext<ICalendarState>) {
		await PushNextCalendarAction.execute(ctx);
	}

	@Action(PushPrevCalendarAction)
	public async pushPrevCalendarAction(ctx: StateContext<ICalendarState>) {
		await PushPrevCalendarAction.execute(ctx);
	}

	@Action(RefreshCalendarAction)
	public async refreshCalendarAction(ctx: StateContext<ICalendarState>) {
		await RefreshCalendarAction.execute(ctx);
	}

}
