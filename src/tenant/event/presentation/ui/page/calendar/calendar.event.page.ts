import {AfterViewInit, Component, inject, OnDestroy, OnInit, viewChild, ViewEncapsulation} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {Store} from "@ngxs/store";
import {CalendarQueries} from "@tenant/event/infrastructure/state/calendar/calendar.queries";
import {DateTime} from "luxon";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {filter, take, withLatestFrom} from "rxjs";
import {DEFAULT_PRESENTATION_CALENDAR_TYPE} from "@tenant/event/domain/enum/presentation-calendar-type.enum";
import {PushPrevCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/push.prev.calendar.action";
import {PushNextCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/push.next.calendar.action";
import {NGXLogger} from "ngx-logger";
import {
	DataCalendarDomManipulationService
} from "@tenant/event/presentation/dom-manipulation-service/data.calendar.dom-manipulation-service";
import {TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {InitCalendarAction} from "@tenant/event/infrastructure/state/calendar/actions/init.calendar.action";
import {
	ContainerCalendarComponent
} from "@tenant/event/presentation/ui/component/calendar/container.calendar.component";

@Component({
	selector: 'app-event-calendar-page',
	encapsulation: ViewEncapsulation.None,
	imports: [
		ContainerCalendarComponent,
	],
	providers: [
		DataCalendarDomManipulationService
	],
	standalone: true,
	template: `
		<!--<event-filter-component/>-->
		<event-calendar-container-component
			[currentDate]="currentDate"
			[preferencesOfCalendars]="preferencesOfCalendars"
			[hidden]="initialized.isFalse"/>
	`
})
export default class CalendarEventPage extends Reactive implements OnInit, AfterViewInit, OnDestroy {

	public currentDate: Date = DateTime.local().startOf(DEFAULT_PRESENTATION_CALENDAR_TYPE).toJSDate();
	readonly containerOfCalendarsRef = viewChild.required(ContainerCalendarComponent);
	public readonly initialized = new BooleanStreamState(false);
	public readonly isPushingNextCalendar = new BooleanStreamState(false);
	public readonly isPushingPrevCalendar = new BooleanStreamState(false);
	public readonly preferencesOfCalendars: {
		from: Date;
		to: Date;
	}[] = [];
	private readonly calendarDomManipulationService = inject(DataCalendarDomManipulationService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly translateService = inject(TranslateService);
	private readonly document = inject(DOCUMENT);
	// Hours
	private readonly selectedHour = '06:00';
	private readonly presentationType$ = this.store.select(CalendarQueries.presentationType);
	private readonly dateRanges$ = this.store.select(CalendarQueries.dateRanges);
	private readonly firstDate$ = this.store.select(CalendarQueries.firstDate);
	private readonly lastDate$ = this.store.select(CalendarQueries.lastDate);
	private readonly dataByType$ = this.store.select(CalendarQueries.dataByType);
	// Dates
	private readonly currentDate$ = this.store.select(CalendarQueries.currentDate);

	constructor() {
		super();
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.store.dispatch(new InitCalendarAction());
	}

	public ngOnInit() {
		this.store.dispatch(new InitCalendarAction());

		this.dataByType$.pipe(this.takeUntil()).subscribe((dataByType) => {
			this.ngxLogger.debug('dataByType', dataByType);
			// Get data from dataByType
			Object.values(dataByType).forEach((events) => {
				events.forEach((event) => {
					this.calendarDomManipulationService.pushDataOrFindAndReplaceIfTheyAreDifferent(event);
				});
			});
		});

		this.currentDate$.pipe(this.takeUntil(), filter(() => this.initialized.isTrue)).subscribe((currentDate) => {
			this.ngxLogger.debug('currentDate', currentDate);
			this.currentDate = currentDate;
			// TODO reset all calendars
			this.containerOfCalendarsRef().initCurrentCalendar();
		});

		this.firstDate$.pipe(
			this.takeUntil(),
			filter(() => this.initialized.isTrue),
			filter(() => this.isPushingPrevCalendar.isTrue),
			withLatestFrom(this.presentationType$),
		).subscribe(([firstDate, presentationType]) => {
			this.ngxLogger.debug('firstDate', firstDate);
			const fromDateTime = DateTime.fromJSDate(firstDate);
			const toDateTime = DateTime.fromJSDate(firstDate).plus({[presentationType]: 1});
			this.fillUpPreferencesOfCalendars(fromDateTime, toDateTime, false);
			this.isPushingPrevCalendar.doFalse();
		});

		this.lastDate$.pipe(
			this.takeUntil(),
			filter(() => this.initialized.isTrue),
			filter(() => this.isPushingNextCalendar.isTrue),
			withLatestFrom(this.presentationType$),
		).subscribe(([lastDate, presentationType]) => {
			this.ngxLogger.debug('lastDate', lastDate);
			const fromDateTime = DateTime.fromJSDate(lastDate);
			const toDateTime = DateTime.fromJSDate(lastDate).plus({[presentationType]: 1});
			this.fillUpPreferencesOfCalendars(fromDateTime, toDateTime);
			this.isPushingNextCalendar.doFalse();
		});

		this.dateRanges$.pipe(this.takeUntil(), take(1)).subscribe((dateRanges) => {
			this.ngxLogger.debug('dateRanges', dateRanges);
			dateRanges.forEach(({from, to}) => {
				const fromDateTime = DateTime.fromJSDate(from);
				const toDateTime = DateTime.fromJSDate(to);
				this.fillUpPreferencesOfCalendars(fromDateTime, toDateTime);
			});
		});
	}

	ngAfterViewInit() {

		this.initHandlers();
		this.containerOfCalendarsRef().initCurrentCalendar();
		this.initialized.doTrue();

	}

	/**
	 * @description Fill up preferences of calendars
	 * @param fromDateTime - from date time
	 * @param toDateTime - to date time
	 * @param push - push or unshift
	 * @private
	 */
	private fillUpPreferencesOfCalendars(fromDateTime: DateTime, toDateTime: DateTime, push = true) {

		this.ngxLogger.debug('fillUpPreferencesOfCalendars', fromDateTime, toDateTime);

		fromDateTime = fromDateTime.setLocale(this.translateService.currentLang);
		toDateTime = toDateTime.setLocale(this.translateService.currentLang);

		const preferences = {
			from: fromDateTime.toJSDate(),
			to: toDateTime.toJSDate(),
		};

		if (push) {
			this.preferencesOfCalendars.push(preferences);
		} else {
			const currentPosition = this.containerOfCalendarsRef().elementRef.nativeElement.scrollLeft;
			this.preferencesOfCalendars.unshift(preferences);
			this.containerOfCalendarsRef().scrollToCorrectPosition(currentPosition);
		}

	}

	/**
	 * @description Init handlers
	 * @private
	 */
	private initHandlers() {
		const prevCallback = () => {
			// Add prev calendar
			if (this.isPushingPrevCalendar.isFalse) {
				this.isPushingPrevCalendar.doTrue();
				this.store.dispatch(new PushPrevCalendarAction());
			}
		};
		const nextCallback = () => {
			// Add next calendar
			if (this.isPushingNextCalendar.isFalse) {
				this.isPushingNextCalendar.doTrue();
				this.store.dispatch(new PushNextCalendarAction());
			}
		}
		this.containerOfCalendarsRef().initHandlerOnHorizontalScroll(prevCallback, nextCallback);
	}

}
