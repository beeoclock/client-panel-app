import {Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {DateTime} from "luxon";
import {
	DEFAULT_PRESENTATION_CALENDAR_TYPE,
	PresentationCalendarType
} from "@tenant/event/domain/enum/presentation-calendar-type.enum";
import {PushNextCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/push.next.calendar.action";
import {PushPrevCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/push.prev.calendar.action";
import {GetListCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/get-list.calendar.action";
import {IEvent} from "@tenant/event/domain";
import {InitCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/init.calendar.action";
import {RefreshCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/refresh.calendar.action";

export interface ICalendarState {
	calendarDataByType: { [key: string]: IEvent[] }; // key - ISO, value - events
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
	name: 'calendarOfEvents',
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

	// private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);

	@Action(GetListCalendarAction)
	public async getListCalendarAction(ctx: StateContext<ICalendarState>, action: GetListCalendarAction) {
		// await GetListCalendarAction.execute(ctx, action.payload, this.listMergedEventApiAdapter);
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
