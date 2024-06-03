import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	inject,
	OnInit,
	QueryList,
	ViewChild,
	ViewChildren,
	ViewEncapsulation
} from "@angular/core";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {
	EventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/event.calendar-with-specialist.widget.component";
import {
	CalendarWithSpecialistLocaStateService
} from "@page/event/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {Reactive} from "@utility/cdk/reactive";
import {NGXLogger} from "ngx-logger";
import {
	HeaderCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/header.calendar-with-specialist.widget.component";
import {map, tap} from "rxjs";
import {IEvent_V2} from "@event/domain";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Store} from "@ngxs/store";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {IAbsenceDto} from "@absence/external/interface/i.absence.dto";
import {ActivatedRoute} from "@angular/router";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {TranslateModule} from "@ngx-translate/core";
import {
	EmptySlotCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/empty-slot.calendar-with-specialist.widget.component";
import {RIMember} from "@member/domain";
import {
	TimeLineCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/time-line.calendar-with-specialist.widget.component";
import {
	DateControlCalendarWithSpecialistsComponent
} from "../../filter/date-control/date-control.calendar-with-specialists.component";

@Component({
	selector: 'app-calendar-with-specialists-widget-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-with-specialist.widget.component.html',
	imports: [
		NgForOf,
		AsyncPipe,
		AutoRefreshComponent,
		DateControlCalendarWithSpecialistsComponent,
		NgIf,
		EventCalendarWithSpecialistWidgetComponent,
		HeaderCalendarWithSpecialistWidgetComponent,
		TranslateModule,
		EmptySlotCalendarWithSpecialistWidgetComponent,
		TimeLineCalendarWithSpecialistWidgetComponent,
	]
})
export class CalendarWithSpecialistWidgetComponent extends Reactive implements OnInit, AfterViewInit {

	public changeEventPositionIsOn = false;
	public handleChangeEventForDraggingEnabledElement = false;

	public readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly activatedRoute = inject(ActivatedRoute);

	@ViewChild('calendar')
	public calendar!: ElementRef<HTMLDivElement>;

	public readonly isToday$ = this.store.select(CalendarWithSpecialistsQueries.isToday);
	public readonly showTimeLine$ = this.isToday$.pipe(
		tap((isToday) => {
			if (!isToday) {
				// Scroll to first rendered event
				const firstEvent = document.querySelector('[data-is-event="true"]');
				if (firstEvent) {
					// TODO: refactoring this part of code, move the coee as function and call at first recived data of events
					firstEvent.scrollIntoView({behavior: 'smooth', block: 'start'});
				} else {
					// Scroll to the earliest schedule time
					let topToScroll = this.calendarWithSpecialistLocaStateService.earliestScheduleInSeconds / 60;
					topToScroll = topToScroll * this.calendarWithSpecialistLocaStateService.oneMinuteForPx;

					this.calendar.nativeElement.scrollTo({top: topToScroll, behavior: 'smooth'});
				}
			}
		})
	);


	public trackByHour(index: number, hour: {
		original: number;
		hour: string;
	}): string {
		return hour.hour;
	}

	public trackById(index: number, item: IEvent_V2): string {
		return item._id;
	}

	public trackByMemberId(index: number, item: RIMember): string {
		return item._id;
	}

	public eventsBySpecialistId: {
		[key: string]: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; } | IAbsenceDto>[]
	} = {};

	private readonly events$ = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
		this.takeUntil(),
		map((items) => {

			return items.reduce((acc, event) => {

				const {attendees, entireBusiness} = event;

				if (entireBusiness) {

					this.calendarWithSpecialistLocaStateService.members.forEach((member) => {

						const {_id: specialistId} = member;

						acc[specialistId] = acc[specialistId] || [];

						acc[specialistId].push(structuredClone(event));

					});

				} else {

					attendees.forEach((attendee) => {

						if (attendee.is !== 'specialist') {
							return;
						}

						const specialistId = attendee._id as string;

						acc[specialistId] = acc[specialistId] || [];

						// Push event into specialist's list and filter out other specialists but keep customers
						acc[specialistId].push(structuredClone({
							...event,
							attendees: event.attendees.filter((attendee) => {
								if (attendee.is === 'specialist') {
									return attendee._id === specialistId;
								}
								return true;
							})
						}));

					});

				}

				return acc;

			}, {} as { [key: string]: IEvent_V2<{ order: IOrderDto; service: IOrderServiceDto; } | IAbsenceDto>[] });

		}),
	);


	public readonly loader$ = this.store.select(CalendarWithSpecialistsQueries.loader);

	public ngOnInit() {

		this.detectDateInQueryParams();
		this.calendarWithSpecialistLocaStateService.eventCalendarWithSpecialistWidgetComponent$.pipe(
			this.takeUntil()
		).subscribe((eventCalendarWithSpecialistWidgetComponent) => {
			this.initListenersFor(eventCalendarWithSpecialistWidgetComponent);
		});
		this.events$.pipe(this.takeUntil()).subscribe((eventsBySpecialistId) => {

			this.eventsBySpecialistId = eventsBySpecialistId;
			setTimeout(() => {
				this.columnList.forEach((column) => {
					this.findAndFixNearEventsWidthInEachColumn(column);
				});
			}, 0);
		});

	}

	public ngAfterViewInit() {

		this.columnList.changes.pipe(
			this.takeUntil()
		).subscribe((columnList: ElementRef<HTMLDivElement>[]) => {
			columnList.forEach((column) => {
				this.findAndFixNearEventsWidthInEachColumn(column);
			});
		});
	}

	public async forceRefresh() {

		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());

	}

	private detectDateInQueryParams() {
		const {date} = this.activatedRoute.snapshot.queryParams;

		if (!date) {
			this.forceRefresh().then();
			return;
		}

		this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
			date
		}));
	}


	// Find all #column
	@ViewChildren('column')
	public columnList!: QueryList<ElementRef<HTMLDivElement>>;

	public eventCalendarWithSpecialistWidgetComponent: EventCalendarWithSpecialistWidgetComponent | null = null;

	public get thereSomeEventCalendarWithSpecialistWidgetComponent() {
		return !!this.eventCalendarWithSpecialistWidgetComponent;
	}

	mutatedOtherEventHtmlList: HTMLDivElement[] = [];

	mouseDown = false;
	prevMousePosition = {x: 0, y: 0};
	whatIsDragging: 'position' | 'top' | 'bottom' | null = null;

	moveCallback = {
		position: (htmlDivElement: HTMLElement, diffY: number) => {

			const currentTop = htmlDivElement.offsetTop;
			const newTop = currentTop + diffY;

			// Check if new top position is not out of column + specialist cell height
			if (newTop > this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx) {
				// Check of new top position is not out of the bottom of the column
				// Get event height
				const eventHeight = htmlDivElement.clientHeight;
				// Check if new top position is not out of the bottom of the column
				if ((newTop + eventHeight) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
					htmlDivElement.style.top = `${newTop}px`;
				}
			}
		},
		top: (htmlDivElement: HTMLElement, diffY: number) => {

			// Change height of the event and top position
			const currentTop = htmlDivElement.offsetTop;
			const newTop = currentTop + diffY;
			const currentHeight = htmlDivElement.clientHeight;
			const newHeight = currentHeight - diffY;

			// Check if new top position is not out of column + specialist cell height
			if (newTop > this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx) {
				// Check of new top position is not out of the bottom of the column
				// Get event height
				const eventHeight = htmlDivElement.clientHeight;
				// Check if new top position is not out of the bottom of the column
				if ((newTop + eventHeight) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
					// Check if newTop is not out of bottom of the event
					if (newTop <= (currentTop + currentHeight)) {
						htmlDivElement.style.top = `${newTop}px`;
						htmlDivElement.style.height = `${newHeight}px`;
					}
				}
			}

		},
		bottom: (htmlDivElement: HTMLElement, diffY: number) => {

			// Change height of the event
			const currentHeight = htmlDivElement.clientHeight;
			const newHeight = currentHeight + diffY;

			// Check of new top position is not out of the bottom of the column
			// Check if new top position is not out of the bottom of the column
			if ((newHeight + htmlDivElement.offsetTop) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
				htmlDivElement.style.height = `${newHeight}px`;
			}
		}
	};

	@HostListener('document:mouseup')
	public documentMouseUpListener() {
		this.ngxLogger.info('documentMouseUpListener: mouseDown false and changeEventPositionIsOn false');
		this.mouseDown = false;
		this.changeEventPositionIsOn = false;
		this.handleChangeEventForDraggingEnabledElement = false;
	}

	@HostListener('document:panend')
	public panend() {
		this.ngxLogger.info('panend');
		this.mouseDown = false;
		this.changeEventPositionIsOn = false;
		this.handleChangeEventForDraggingEnabledElement = false;

	}

	@HostListener('document:mousedown', ['$event'])
	public documentMouseDownListener(event: MouseEvent) {


		if (!event) {
			return;
		}

		if (!this.eventCalendarWithSpecialistWidgetComponent) {
			return;
		}

		const {target} = event as unknown as MouseEvent & { target: HTMLElement }

		if (!target) {
			return;
		}

		this.whatIsDragging = (target.dataset.dragging ?? null) as 'position' | 'top' | 'bottom' | null;
		this.handleChangeEventForDraggingEnabledElement = this.whatIsDragging !== null;
		this.changeEventPositionIsOn = this.whatIsDragging === 'position';

		this.ngxLogger.info('documentMouseDownListener: ', {
			event,
			whatIsDragging: this.whatIsDragging,
			handleChangeEventForDraggingEnabledElement: this.handleChangeEventForDraggingEnabledElement,
			changeEventPositionIsOn: this.changeEventPositionIsOn
		});

		if (this.whatIsDragging === null) {
			return;
		}

		this.mouseDown = true;
		this.prevMousePosition = {x: event.clientX, y: event.clientY};

	}


	// For mobile

	public touchStartListener = (event: TouchEvent) => {
		this.documentMouseDownListener(event.touches[0] as unknown as MouseEvent);
	}

	public touchMoveListener = (event: TouchEvent) => {
		if (!this.mouseDown) {
			return;
		}
		if (!this.handleChangeEventForDraggingEnabledElement) {
			return;
		}

		this.mouseMoveListener(event.touches[0] as unknown as MouseEvent, true);
		event.preventDefault();
		event.stopPropagation();
	}

	public mouseUpListener = () => {
		this.ngxLogger.info('mouseUpListener: delete all listeners');
		this.mutatedOtherEventHtmlList.length = 0;

		this.mouseDown = false;
		this.changeEventPositionIsOn = false;
		this.handleChangeEventForDraggingEnabledElement = false;
		this.eventCalendarWithSpecialistWidgetComponent?.toggleMode(false);

		this.prevMousePosition = {x: 0, y: 0};
		// Delete listeners
		document.removeEventListener('mousemove', this.mouseMoveListener, false);
		document.removeEventListener('touchstart', this.touchStartListener, false);
		document.removeEventListener('touchmove', this.touchMoveListener, false);

		this.changeDetectorRef.detectChanges();
	}

	public mouseMoveListener = (event: MouseEvent, isMobile: boolean = false) => {

		if (!this.mouseDown) {
			return;
		}

		this.ngxLogger.info('mouseMoveListener: ', event);

		// Step is to change height of the event is: 5 minutes what is equal to (120px/60px)*5 = 10px
		// So, user can't change height of the event less than 10px every step
		const diffY = event.clientY - this.prevMousePosition.y;

		this.prevMousePosition = {x: event.clientX, y: event.clientY};

		const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef.nativeElement;

		if (!htmlDivElement) {
			return;
		}

		if (this.whatIsDragging) {
			(this.moveCallback[this.whatIsDragging])?.(htmlDivElement, diffY);
		}

		this.eventCalendarWithSpecialistWidgetComponent?.someUpdateFromExternal();

		// Detect if htmlDivElement is near to another htmlDivElement if yes then change width of the events

		// Check if htmlDivElement is near to another htmlDivElement
		const column = htmlDivElement.parentElement;
		if (!column) {
			return;
		}

		const restoreWidthOfMutatedEvents = () => {
			this.mutatedOtherEventHtmlList.forEach((element, index) => {
				element.style.width = `${column.clientWidth / this.mutatedOtherEventHtmlList.length}px`;
				element.style.transform = `translateX(calc(100% * ${index}))`;
			});
		};

		if (isMobile) {
			if (this.changeEventPositionIsOn) {
				this.columnList.forEach((column) => {
					// Find if event is now in other column
					const rect = column.nativeElement.getBoundingClientRect();
					if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
						const newIndex = column.nativeElement.dataset.index;
						if (!newIndex) {
							return;
						}
						column.nativeElement.appendChild(htmlDivElement);
						this.eventCalendarWithSpecialistWidgetComponent?.changeMember(this.calendarWithSpecialistLocaStateService.members[Number(newIndex) - 1]);
					}
				});
			}
		}

		const nearEvents = column.querySelectorAll('[data-is-event="true"]');

		if (!nearEvents.length || nearEvents.length === 1) {
			htmlDivElement.style.width = '100%';
			htmlDivElement.style.transform = `translateX(0)`;
			restoreWidthOfMutatedEvents();
			return;
		}

		this.fixNearEventsWidth(nearEvents, htmlDivElement, column, () => {
			restoreWidthOfMutatedEvents();
		});

	}

	public initListenersFor(eventCalendarWithSpecialistWidgetComponent: EventCalendarWithSpecialistWidgetComponent | null) {
		this.ngxLogger.info('initListenersFor: ', eventCalendarWithSpecialistWidgetComponent);

		this.eventCalendarWithSpecialistWidgetComponent = eventCalendarWithSpecialistWidgetComponent;

		if (!this.eventCalendarWithSpecialistWidgetComponent) {

			this.mouseUpListener();
			this.changeDetectorRef.detectChanges();
			return;
		}

		document.addEventListener('mousemove', this.mouseMoveListener, false);
		document.addEventListener('touchstart', this.touchStartListener, {passive: false});
		document.addEventListener('touchmove', this.touchMoveListener, {passive: false});

		this.changeDetectorRef.detectChanges();

	}

	public mouseover($event: MouseEvent | TouchEvent) {

		const {target} = $event as unknown as MouseEvent & { target: HTMLElement }

		if (!this.mouseDown) {
			return;
		}

		if (!target) {
			return;
		}

		if (!this.changeEventPositionIsOn) {
			return;
		}

		const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef?.nativeElement;

		if (!htmlDivElement) {
			return;
		}
		const columnIndex = target.dataset.index;

		if (!columnIndex) {
			return;
		}

		if (htmlDivElement.dataset.columnIndex === columnIndex) {
			return;
		}

		// Move event to another column
		// Move HTML element to another column

		const column = document.querySelector(`[data-index="${columnIndex}"]`);
		if (!column) {
			return;
		}
		column.appendChild(htmlDivElement);
		const index = Number(columnIndex) - 1;
		const member = this.calendarWithSpecialistLocaStateService.members[index];
		this.eventCalendarWithSpecialistWidgetComponent?.changeMember(member);

	}


	public mouseEnter($event: MouseEvent | TouchEvent) {
		const {target} = $event as unknown as MouseEvent & { target: HTMLElement }

		if (!this.mouseDown) {
			return;
		}

		if (!target) {
			return;
		}

		if (!this.changeEventPositionIsOn) {
			return;
		}

		const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef?.nativeElement;

		if (!htmlDivElement) {
			return;
		}
		const columnIndex = target.dataset.index;

		if (!columnIndex) {
			return;
		}

		if (htmlDivElement.dataset.columnIndex === columnIndex) {
			return;
		}

		// Move event to another column
		// Move HTML element to another column

		const column = document.querySelector(`[data-index="${columnIndex}"]`);
		if (!column) {
			return;
		}
		column.appendChild(htmlDivElement);
		// Change data-column-index attribute
		if (this.eventCalendarWithSpecialistWidgetComponent) {

			const index = Number(columnIndex) - 1;
			const member = this.calendarWithSpecialistLocaStateService.members[index];
			this.eventCalendarWithSpecialistWidgetComponent?.changeMember(member);

		}
	}

	/**
	 * Possible value of sourceTop, sourceBottom, targetTop, targetBottom is 423.515625,
	 * so we have to cut off the decimal part by `$value | 0` and
	 * divide it by oneMinuteForPx from calendarWithSpecialistLocaStateService
	 *
	 * @param target
	 * @param source
	 */
	public targetIsNearOfSource(target: HTMLElement, source: HTMLElement): boolean {

		let {top: sourceTop, bottom: sourceBottom} = source.getBoundingClientRect();

		// [IMPORTANT] sourceTop has relative value of current height per hour on UI layout, so we have to convert it to minutes to know the exact position
		sourceTop = sourceTop / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;
		sourceTop = sourceTop | 0;

		// [IMPORTANT] sourceBottom has relative value of current height per hour on UI layout, so we have to convert it to minutes to know the exact position
		sourceBottom = sourceBottom / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;
		sourceBottom = sourceBottom | 0;

		const htmlElement = target as HTMLDivElement;
		let {top: targetTop, bottom: targetBottom} = htmlElement.getBoundingClientRect();

		// [IMPORTANT] targetTop has relative value of current height per hour on UI layout, so we have to convert it to minutes to know the exact position
		targetTop = targetTop / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;
		targetTop = targetTop | 0;

		// [IMPORTANT] targetBottom has relative value of current height per hour on UI layout, so we have to convert it to minutes to know the exact position
		targetBottom = targetBottom / this.calendarWithSpecialistLocaStateService.oneMinuteForPx;
		targetBottom = targetBottom | 0;

		const htmlElementInside = targetTop > sourceTop && targetBottom < sourceBottom;
		if (htmlElementInside) {
			return true;
		}
		const htmlElementTop = targetTop > sourceTop && targetTop < sourceBottom;
		if (htmlElementTop) {
			return true;
		}
		const htmlElementBottom = targetBottom > sourceTop && targetBottom < sourceBottom;
		if (htmlElementBottom) {
			return true;
		}
		const htmlElementOutside = targetTop < sourceTop && targetBottom > sourceBottom;
		return htmlElementOutside;

	}

	public findAndFixNearEventsWidthInEachColumn(column: ElementRef<HTMLDivElement>) {

		const columnElement = column.nativeElement;

		const events = columnElement.querySelectorAll('[data-is-event="true"]');

		if (!events.length) {
			return;
		}

		const eventsArray = Array.from(events);

		eventsArray.forEach((event) => {

			const eventElement = event as HTMLDivElement;

			this.fixNearEventsWidth(events, eventElement, columnElement);

		});

		this.changeDetectorRef.detectChanges();

	}

	public fixNearEventsWidth(nearEvents: NodeListOf<Element>, htmlDivElement: HTMLElement, column: HTMLElement, callbackIfNoNearEvents: (() => void) = (() => {
	})) {
		const findNearEvents = Array.from(nearEvents).filter((element) => {
			if (element === htmlDivElement) {
				return false;
			}

			return this.targetIsNearOfSource(element as HTMLDivElement, htmlDivElement);

		});

		if (!findNearEvents.length) {
			htmlDivElement.style.width = '100%';
			htmlDivElement.style.transform = `translateX(0)`;
			callbackIfNoNearEvents();
			return;
		}

		const top = htmlDivElement.offsetTop;
		const htmlDivElementHasSmollerTop = findNearEvents.every((element) => {
			const elm = element as HTMLDivElement;
			return elm.offsetTop > top;
		});

		// [IMPORTANT] Only if dragging is enabled
		if (this.handleChangeEventForDraggingEnabledElement) {
			this.mutatedOtherEventHtmlList.length = 0;
		}

		findNearEvents.forEach((element, index) => {
			if (element === htmlDivElement) {
				return;
			}
			const elm = element as HTMLDivElement;

			// [IMPORTANT] Only if dragging is enabled
			if (this.handleChangeEventForDraggingEnabledElement) {
				this.mutatedOtherEventHtmlList.push(elm);
			}

			elm.style.width = `${column.clientWidth / (findNearEvents.length + 1)}px`;
			elm.style.transform = `translateX(calc(100% * ${index + (htmlDivElementHasSmollerTop ? 1 : 0)}))`
		});

		htmlDivElement.style.width = `${column.clientWidth / (findNearEvents.length + 1)}px`;
		htmlDivElement.style.transform = `translateX(calc(100% * ${(htmlDivElementHasSmollerTop ? 0 : findNearEvents.length)}))`;
	}

}
