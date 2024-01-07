import {inject, Injectable} from "@angular/core";
import {Action, NgxsOnInit, State, StateContext} from "@ngxs/store";
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
export class CalendarState implements NgxsOnInit {

	private readonly listMergedEventApiAdapter = inject(ListMergedEventApiAdapter);

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

	@Action(GetListCalendarAction)
	public async getListCalendarAction(ctx: StateContext<ICalendarState>) {
		await GetListCalendarAction.execute(ctx, this.listMergedEventApiAdapter);
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
