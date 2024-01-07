import {
	AfterViewInit,
	Component,
	inject,
	OnInit,
	QueryList,
	ViewChild,
	ViewChildren,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import {FilterComponent} from "@event/presentation/component/filter/filter.component";
import {DOCUMENT, NgForOf, NgIf} from "@angular/common";
import {HoursComponent} from "@event/presentation/component/calendar/hours.component";
import {ColumnsBlockComponent} from "@event/presentation/component/calendar/columns-block.component";
import {Store} from "@ngxs/store";
import {CalendarQueries} from "@event/state/calendar/calendar.queries";
import {DateTime, Interval} from "luxon";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {filter, take, withLatestFrom} from "rxjs";
import {DEFAULT_PRESENTATION_CALENDAR_TYPE} from "@event/domain/enum/presentation-calendar-type.enum";
import {PushPrevCalendarAction} from "@event/state/calendar/actions/push.prev.calendar.action";
import {PushNextCalendarAction} from "@event/state/calendar/actions/push.next.calendar.action";
import {NGXLogger} from "ngx-logger";
import {
	CalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/calendar.dom-manipulation-service";

@Component({
	selector: 'event-calendar-page',
	templateUrl: './index.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		FilterComponent,
		NgIf,
		HoursComponent,
		ColumnsBlockComponent,
		NgForOf,
	],
	standalone: true
})
export default class Index implements OnInit, AfterViewInit {

	private readonly calendarDomManipulationService = inject(CalendarDomManipulationService);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly document = inject(DOCUMENT);

	// Hours
	private readonly selectedHour = '06:00';

	private readonly presentationType$ = this.store.select(CalendarQueries.presentationType);
	private readonly dateRanges$ = this.store.select(CalendarQueries.dateRanges);
	private readonly firstDate$ = this.store.select(CalendarQueries.firstDate);
	private readonly lastDate$ = this.store.select(CalendarQueries.lastDate);

	// Dates
	private readonly currentDate$ = this.store.select(CalendarQueries.currentDate);
	private currentDate: Date = DateTime.local().startOf(DEFAULT_PRESENTATION_CALENDAR_TYPE).toJSDate();

	// Ref to last, first and current calendars
	private currentCalendarRef: ColumnsBlockComponent | null = null;

	@ViewChildren(ColumnsBlockComponent)
	private calendarsRef!: QueryList<ColumnsBlockComponent>;

	@ViewChild('hoursComponent', {read: ViewContainerRef})
	private hoursComponentRef!: ViewContainerRef;

	@ViewChild('containerOfCalendars', {read: ViewContainerRef})
	private containerOfCalendarsRef!: ViewContainerRef;

	private selectedHourRef: HTMLElement | null = null;

	public readonly initialized = new BooleanStreamState(false);
	public readonly isPushingNextCalendar = new BooleanStreamState(false);
	public readonly isPushingPrevCalendar = new BooleanStreamState(false);

	public readonly preferencesOfCalendars: {
		from: Date;
		to: Date;
		header: {
			content: string;
			id: string;
		}[];
	}[] = [];

	public ngOnInit() {

		this.currentDate$.pipe(filter(() => this.initialized.isTrue)).subscribe((currentDate) => {
			this.currentDate = currentDate;
			// TODO reset all calendars
			this.initCurrentCalendar();
		});

		this.firstDate$.pipe(
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

		this.dateRanges$.pipe(take(1)).subscribe((dateRanges) => {
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
		this.initRefToSelectedHour();
		this.initCurrentCalendar();
		this.initialized.doTrue();
		this.calendarDomManipulationService
			.initExampleData('02.01.2024-18')
			.initExampleData('04.01.2024-8')
			.initExampleData('06.01.2024-14');
	}

	/**
	 * @description Fill up preferences of calendars
	 * @param fromDateTime - from date time
	 * @param toDateTime - to date time
	 * @param push - push or unshift
	 * @private
	 */
	private fillUpPreferencesOfCalendars(fromDateTime: DateTime, toDateTime: DateTime, push = true) {

		const preferences = {
			from: fromDateTime.toJSDate(),
			to: toDateTime.toJSDate(),
			header: Interval
				.fromDateTimes(fromDateTime, toDateTime)
				.splitBy({day: 1})
				.map((interval) => ({
					content: interval.start?.toFormat('dd.MM (EEE)') ?? '',
					id: interval.start?.toFormat('dd.MM.yyyy') ?? '',
				})),
		};

		if (push) {
			this.preferencesOfCalendars.push(preferences);
		} else {
			const currentPosition = this.containerOfCalendarsRef.element.nativeElement.scrollLeft;
			this.preferencesOfCalendars.unshift(preferences);
			this.scrollToCorrectPosition(currentPosition);
		}

	}

	/**
	 * @description Scroll to correct position
	 * @param prevScrollPosition - previous scroll position
	 * @private
	 */
	private scrollToCorrectPosition(prevScrollPosition: number) {

		if (!this.currentCalendarRef) {
			return;
		}

		// Scroll to prevScrollPosition + width of calendar
		const containerHTML = this.containerOfCalendarsRef.element.nativeElement as HTMLElement;
		containerHTML.scrollTo({
			left: prevScrollPosition + this.currentCalendarRef.elementRef.nativeElement.scrollWidth,
		});
	}

	/**
	 * @description Init handlers
	 * @private
	 */
	private initHandlers() {
		this.initHandlerOnHorizontalScroll();
	}

	/**
	 * @description Init handler on horizontal scroll
	 * @private
	 */
	private initHandlerOnHorizontalScroll() {
		const containerOfCalendarsNativeElement: HTMLElement = this.containerOfCalendarsRef.element.nativeElement;

		containerOfCalendarsNativeElement.addEventListener('scroll', (event) => {
			if (!this.currentCalendarRef) {
				return;
			}

			const currentCalendarNativeElement: HTMLElement = this.currentCalendarRef.elementRef.nativeElement;
			const firstHalfOfCalendarPosition = currentCalendarNativeElement.scrollWidth / 2;
			const lastHalfOfCalendarPosition = containerOfCalendarsNativeElement.scrollWidth - firstHalfOfCalendarPosition;

			if (containerOfCalendarsNativeElement.scrollLeft <= firstHalfOfCalendarPosition) {
				// Add prev calendar
				if (this.isPushingPrevCalendar.isFalse) {
					this.isPushingPrevCalendar.doTrue();
					this.store.dispatch(new PushPrevCalendarAction());
				}
			}

			if ((containerOfCalendarsNativeElement.scrollLeft + currentCalendarNativeElement.scrollWidth) >= lastHalfOfCalendarPosition) {
				// Add next calendar
				if (this.isPushingNextCalendar.isFalse) {
					this.isPushingNextCalendar.doTrue();
					this.store.dispatch(new PushNextCalendarAction());
				}
			}

		});
	}

	/**
	 * @description Init ref to selected hour
	 * @private
	 */
	private initRefToSelectedHour() {
		const elementId = `hours-column-${this.selectedHour}`;
		const selectedHourRef = this.document.getElementById(elementId);

		if (!selectedHourRef) {
			return;
		}

		this.selectedHourRef = selectedHourRef;
	}

	/**
	 * @description Init current calendar
	 * @private
	 */
	private initCurrentCalendar() {
		const currentCalendarRef = this.calendarsRef.find((calendarRef) => {
			return calendarRef.preferences.from.toISOString() === this.currentDate.toISOString();
		});
		if (currentCalendarRef) {
			this.currentCalendarRef = currentCalendarRef;
		}
		this.scrollToCurrentCalendar();
	}

	/**
	 * @description Scroll to current calendar
	 * @private
	 */
	private scrollToCurrentCalendar() {
		if (!this.currentCalendarRef) {
			return;
		}

		const hoursComponentNativeElement: HTMLElement = this.hoursComponentRef.element.nativeElement;
		const left = this.currentCalendarRef.elementRef.nativeElement.offsetLeft - hoursComponentNativeElement.offsetWidth;
		const top = (this.selectedHourRef?.offsetTop ?? 0) - (this.selectedHourRef?.offsetHeight ?? 0);
		this.containerOfCalendarsRef.element.nativeElement.scrollTo({
			left,
			top,
		});
	}

}
