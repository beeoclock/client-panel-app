import {Injectable} from "@angular/core";
import {Action, NgxsOnInit, State, StateContext} from "@ngxs/store";
import {InitCalendarAction} from "@event/state/calendar/actions/init.calendar.action";
import {DateTime} from "luxon";
import {
	DEFAULT_PRESENTATION_CALENDAR_TYPE,
	PresentationCalendarType
} from "@event/domain/enum/presentation-calendar-type.enum";
import {PushNextCalendarAction} from "@event/state/calendar/actions/push.next.calendar.action";
import {PushPrevCalendarAction} from "@event/state/calendar/actions/push.prev.calendar.action";

export interface ICalendarState {
	calendarDataByType: {[key: string]: {a: 1}[]}; // key - ISO, value - events
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
export class CalendarState implements NgxsOnInit {

	public ngxsOnInit(ctx: StateContext<ICalendarState>) {

		const {currentDate, presentationCalendarType} = ctx.getState();
		const currentDateTime = DateTime.fromJSDate(currentDate);
		const prevDateTime = currentDateTime.minus({[presentationCalendarType]: 1});
		const nextDateTime = currentDateTime.plus({[presentationCalendarType]: 1});

		ctx.patchState({
			calendarDataByType: {
				[prevDateTime.toJSDate().toISOString()]: [],
				[currentDate.toISOString()]: [],
				[nextDateTime.toJSDate().toISOString()]: [],
			},
			dateRanges: [
				{
					from: prevDateTime.toJSDate(),
					to: prevDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
				},
				{
					from: currentDateTime.toJSDate(),
					to: currentDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
				},
				{
					from: nextDateTime.toJSDate(),
					to: nextDateTime.plus({[presentationCalendarType]: 1}).toJSDate(),
				},
			],
			firstDate: prevDateTime.toJSDate(),
			lastDate: nextDateTime.toJSDate(),
		});

	}

	@Action(InitCalendarAction)
	public async initAction(ctx: StateContext<ICalendarState>) {
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

}
