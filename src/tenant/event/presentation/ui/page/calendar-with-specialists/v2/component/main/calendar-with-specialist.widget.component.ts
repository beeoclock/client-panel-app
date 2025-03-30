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
	viewChild,
	ViewChildren,
	ViewEncapsulation
} from "@angular/core";
import {AsyncPipe, DOCUMENT} from "@angular/common";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/calendar-with-specialist.loca.state.service";
import {Reactive} from "@core/cdk/reactive";
import {NGXLogger} from "ngx-logger";
import {
	HeaderCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/header.calendar-with-specialist.widget.component";
import {firstValueFrom, map, switchMap} from "rxjs";
import {IEvent_V2} from "@tenant/event/domain";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {IOrder} from "@tenant/order/domain/interface/i.order";
import {IOrderServiceDto} from "@tenant/order/domain/interface/i.order-service.dto";
import {IAbsence} from "@tenant/absence/domain/interface/i.absence";
import {ActivatedRoute} from "@angular/router";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {TranslateModule} from "@ngx-translate/core";
import {
	TimeLineCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/time-line.calendar-with-specialist.widget.component";
import {FormControl} from "@angular/forms";
import {OrderServiceStatusEnum} from "@tenant/order/domain/enum/order-service.status.enum";
import {OrderActions} from "@tenant/order/presentation/state/order/order.actions";
import {DateTime} from "luxon";
import {RISchedule} from "@shared/domain/interface/i.schedule";
import {
	ScheduleElementCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/schedule-element.calendar-with-specialist.widget.component";
import {
	EventCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/event.calendar-with-specialist.widget.component";
import {
	EmptySlotCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/empty-slot.calendar-with-specialist.widget.component";
import {AbsenceDataActions} from "@tenant/absence/infrastructure/state/data/absence.data.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	FilterCalendarWithSpecialistComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/main/filter/filter.calendar-with-specialist.component";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";

@Component({
	selector: 'app-calendar-with-specialists-widget-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-with-specialist.widget.component.html',
	imports: [
		AsyncPipe,
		EventCalendarWithSpecialistWidgetComponent,
		HeaderCalendarWithSpecialistWidgetComponent,
		TranslateModule,
		EmptySlotCalendarWithSpecialistWidgetComponent,
		TimeLineCalendarWithSpecialistWidgetComponent,
		ScheduleElementCalendarWithSpecialistWidgetComponent,
		FilterCalendarWithSpecialistComponent,
	]
})
export class CalendarWithSpecialistWidgetComponent extends Reactive implements OnInit, AfterViewInit {

	public changeEventPositionIsOn = false;
	public handleChangeEventForDraggingEnabledElement = false;
	public readonly orderServiceStatusesControl: FormControl<OrderServiceStatusEnum[]> = new FormControl<OrderServiceStatusEnum[]>([], {
		nonNullable: true
	});

	readonly calendar = viewChild.required<ElementRef<HTMLDivElement>>('calendar');

	public eventsBySpecialistId: {
		[key: string]: IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; } | IAbsence.DTO>[]
	} = {};

	// Find all #column
	@ViewChildren('column')
	public columnList!: QueryList<ElementRef<HTMLDivElement>>;

	public eventCalendarWithSpecialistWidgetComponent: EventCalendarWithSpecialistWidgetComponent | null = null;

	private mutatedOtherEventHtmlList: HTMLDivElement[] = [];
	private mouseDown = false;
	private prevMousePosition = {x: 0, y: 0};
	private whatIsDragging: 'position' | 'top' | 'bottom' | null = null;

	protected readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private moveCallback = {
		accumulationDiffY: 0,
		position: (htmlDivElement: HTMLElement, diffY: number) => {

			this.moveCallback.accumulationDiffY += diffY;

			if (this.moveCallback.accumulationDiffY % this.twoMinutesForPx) {
				return;
			}

			const currentTop = htmlDivElement.offsetTop;
			const newTop = currentTop + this.moveCallback.accumulationDiffY;
			this.moveCallback.accumulationDiffY = 0;

			// Check if new top position is not out of column + specialist cell height
			if (newTop >= this.calendarWithSpecialistLocaStateService.specialistCellHeightForPx) {
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
			this.moveCallback.accumulationDiffY += diffY;

			if (this.moveCallback.accumulationDiffY % this.twoMinutesForPx) {
				return;
			}

			// Change height of the event and top position
			const currentTop = htmlDivElement.offsetTop;
			const newTop = currentTop + this.moveCallback.accumulationDiffY;
			const currentHeight = htmlDivElement.clientHeight;
			const newHeight = currentHeight - this.moveCallback.accumulationDiffY;
			this.moveCallback.accumulationDiffY = 0;

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
			this.moveCallback.accumulationDiffY += diffY;

			if (this.moveCallback.accumulationDiffY % this.twoMinutesForPx) {
				return;
			}

			// Change height of the event
			const currentHeight = htmlDivElement.clientHeight;
			const newHeight = currentHeight + this.moveCallback.accumulationDiffY;
			this.moveCallback.accumulationDiffY = 0;

			// Check of new top position is not out of the bottom of the column
			// Check if new top position is not out of the bottom of the column
			if ((newHeight + htmlDivElement.offsetTop) <= this.calendarWithSpecialistLocaStateService.columnHeightForPx) {
				htmlDivElement.style.height = `${newHeight}px`;
			}
		}
	};
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);
	public readonly schedules$ = this.store.select(BusinessProfileState.schedules);
	public readonly isToday$ = this.store.select(CalendarWithSpecialistsQueries.isToday);
	public readonly showTimeLine$ = this.isToday$.pipe();
	private readonly document = inject(DOCUMENT);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly actions$ = inject(Actions);

	private readonly events$ = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
		this.takeUntil(),
		map((items) => {

			this.ngxLogger.info('CalendarWithSpecialistWidgetComponent:events$: ', items);

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

			}, {} as { [key: string]: IEvent_V2<{ order: IOrder.DTO; service: IOrderServiceDto; } | IAbsence.DTO>[] });

		}),
	);

	public get thereSomeEventCalendarWithSpecialistWidgetComponent() {
		return !!this.eventCalendarWithSpecialistWidgetComponent;
	}

	public get twoMinutesForPx() {
		return this.calendarWithSpecialistLocaStateService.oneMinuteForPx * this.calendarWithSpecialistLocaStateService.movementInMinutesControl.value;
	}

	public nowOrder(target: unknown) {
		return target as { order: IOrder.DTO; service: IOrderServiceDto; };
	}

	public nowAbsence(target: unknown) {
		return target as IAbsence.DTO;
	}

	public async openForm() {

		// From selectedDate$
		const schedules = await firstValueFrom(this.schedules$);
		const selectedDate = await firstValueFrom(this.selectedDate$);
		const now = DateTime.now();
		let defaultAppointmentStartDateTimeIso = selectedDate.toJSDate().toISOString();

		if (selectedDate.hasSame(now, 'day')) {
			defaultAppointmentStartDateTimeIso = now.toJSDate().toISOString();
		} else {
			if (schedules) {
				const foundSchedule = schedules.reduce((acc: null | RISchedule, schedule) => {

					if (acc) {
						if (schedule.workDays.includes(selectedDate.weekday)) {
							if (schedule.startInSeconds < acc.startInSeconds) {
								return schedule;
							}
						}
					} else {
						if (schedule.workDays.includes(selectedDate.weekday)) {
							return schedule;
						}
					}

					return acc;
				}, null);

				if (foundSchedule) {

					defaultAppointmentStartDateTimeIso = selectedDate.plus({
						seconds: foundSchedule.startInSeconds
					}).toJSDate().toISOString();

				}

			}
		}

		this.store.dispatch(
			new OrderActions.OpenForm({
				componentInputs: {
					setupPartialData: {
						defaultAppointmentStartDateTimeIso,
					}
				}
			})
		);
	}

	public ngOnInit() {

		this.ngxLogger.info('CalendarWithSpecialistWidgetComponent: ngOnInit');

		this.detectParamsInQueryParams();
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
			this.changeDetectorRef.detectChanges();
		});

		this.actions$
			.pipe(
				this.takeUntil(),
				ofActionSuccessful(
					AbsenceDataActions.SetState,
					AbsenceDataActions.UpdateItem,
					AbsenceDataActions.CreateItem,

					OrderActions.ChangeStatus,
					OrderActions.CreateItem,
					OrderActions.UpdateItem,
					OrderActions.SetState,
					OrderActions.OrderedServiceStatus,
					OrderActions.OrderedServiceState,
				)
			).subscribe(() => {
			this.dispatchActionToUpdateCalendar();
		});

		this.store.select(CalendarWithSpecialistsQueries.params).pipe(
			this.takeUntil(),
		).subscribe((params) => {
			if ('statuses' in params) {
				const {statuses} = params;
				if (statuses) {
					this.orderServiceStatusesControl.setValue(statuses as any, {
						emitEvent: false,
						onlySelf: true
					});
				}
			}
		});

		this.orderServiceStatusesControl.valueChanges.pipe(
			this.takeUntil(),
			switchMap((statuses) => {
				return this.store.dispatch(
					new CalendarWithSpecialistsAction.UpdateFilters({
						statuses
					})
				)
			}),
		).subscribe(() => {
			this.dispatchActionToUpdateCalendar();
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

		// Check if data is empty if true then dispatch action to get items
		firstValueFrom(this.store.select(CalendarWithSpecialistsQueries.data)).then((data) => {
			if (!data.length) {
				this.dispatchActionToUpdateCalendar();
			}
		});

	}

	@Dispatch()
	public dispatchActionToUpdateCalendar() {
		return new CalendarWithSpecialistsAction.GetItems();
	}

	@HostListener('mouseup')
	public documentMouseUpListener() {
		this.ngxLogger.info('documentMouseUpListener: mouseDown false and changeEventPositionIsOn false');
		this.mouseDown = false;
		this.changeEventPositionIsOn = false;
		this.handleChangeEventForDraggingEnabledElement = false;
	}

	@HostListener('panend')
	public panend() {
		this.ngxLogger.info('panend');
		this.mouseDown = false;
		this.changeEventPositionIsOn = false;
		this.handleChangeEventForDraggingEnabledElement = false;

	}

	@HostListener('mousedown', ['$event'])
	public documentMouseDownListener(event: MouseEvent) {
		this.ngxLogger.info('documentMouseDownListener: ', event);

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

	public touchStartListener = (event: TouchEvent) => {
		this.documentMouseDownListener(event.touches[0] as unknown as MouseEvent);
	}


	// For mobile

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
		this.document.removeEventListener('mousemove', this.mouseMoveListener, false);
		this.document.removeEventListener('touchstart', this.touchStartListener, false);
		this.document.removeEventListener('touchmove', this.touchMoveListener, false);

		this.changeDetectorRef.detectChanges();
	}

	public mouseMoveListener = (event: MouseEvent, isMobile: boolean = false) => {

		if (!this.mouseDown) {
			return;
		}

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
			this.restoreWidthOfMutatedEvents(column);
			return;
		}

		this.fixNearEventsWidth(Array.from(nearEvents) as HTMLDivElement[], htmlDivElement, column, () => {
			this.restoreWidthOfMutatedEvents(column);
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

		this.document.addEventListener('mousemove', this.mouseMoveListener, false);
		this.document.addEventListener('touchstart', this.touchStartListener, {passive: false});
		this.document.addEventListener('touchmove', this.touchMoveListener, {passive: false});

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

		const column = this.document.querySelector(`[data-index="${columnIndex}"]`);
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

		const column = this.document.querySelector(`[data-index="${columnIndex}"]`);
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

		switch (true) {
			case targetTop > sourceTop && targetBottom < sourceBottom: // target is inside source
			case targetTop <= sourceTop && sourceTop < targetBottom: // targetTop is inside source
			case targetBottom >= sourceBottom && sourceBottom > targetTop: // targetBottom is inside source
			case targetTop < sourceTop && targetBottom > sourceBottom: // target is outside source
			case targetTop === sourceTop && targetBottom === sourceBottom: // target is equal to source
				return true;
		}

		return false;


	}

	public findAndFixNearEventsWidthInEachColumn(column: ElementRef<HTMLDivElement>) {

		const columnElement = column.nativeElement;

		const events = columnElement.querySelectorAll('[data-is-event="true"]');

		if (!events.length) {
			return;
		}

		const eventsArray = Array.from(events) as HTMLDivElement[];

		eventsArray.forEach((event) => {

			const eventElement = event as HTMLDivElement;

			this.fixNearEventsWidth(eventsArray, eventElement, columnElement);

		});

		this.changeDetectorRef.detectChanges();

	}

	public fixNearEventsWidth(nearEvents: HTMLElement[], htmlDivElement: HTMLElement, column: HTMLElement, callbackIfNoNearEvents: (() => void) = (() => {
	})) {
		let foundNearEvents = nearEvents.reduce((acc, element) => {
			if (element === htmlDivElement) {
				return acc;
			}

			if (acc.some((e) => e === element)) {
				return acc;
			}

			if (this.targetIsNearOfSource(element, htmlDivElement)) {
				acc.push(element);
			}

			return acc;

		}, [] as HTMLElement[]);

		foundNearEvents = foundNearEvents.reduce((acc, element, index) => {
			const result = foundNearEvents.filter((elm) => {
				if (elm === element) {
					return false;
				}
				return this.targetIsNearOfSource(elm, element);

			});


			acc.push(...result);
			if (!acc.length && index === foundNearEvents.length - 1) {
				acc.push(element);
			}
			return acc;
		}, [] as HTMLElement[]);

		if (!foundNearEvents.length) {
			htmlDivElement.style.width = '100%';
			htmlDivElement.style.transform = `translateX(0)`;
			callbackIfNoNearEvents();
			return;
		}

		const top = htmlDivElement.offsetTop;
		const htmlDivElementHasSmollerTop = foundNearEvents.every((element) => {
			const elm = element as HTMLDivElement;
			return elm.offsetTop > top;
		});

		// [IMPORTANT] Only if dragging is enabled
		if (this.handleChangeEventForDraggingEnabledElement) {
			this.mutatedOtherEventHtmlList.length = 0;
		}

		foundNearEvents.forEach((element, index) => {
			if (element === htmlDivElement) {
				return;
			}
			const elm = element as HTMLDivElement;

			// [IMPORTANT] Only if dragging is enabled
			if (this.handleChangeEventForDraggingEnabledElement) {
				this.mutatedOtherEventHtmlList.push(elm);
			}

			elm.style.width = `${column.clientWidth / (foundNearEvents.length + 1)}px`;
			elm.style.transform = `translateX(calc(100% * ${index + (htmlDivElementHasSmollerTop ? 1 : 0)}))`
		});

		htmlDivElement.style.width = `${column.clientWidth / (foundNearEvents.length + 1)}px`;
		htmlDivElement.style.transform = `translateX(calc(100% * ${(htmlDivElementHasSmollerTop ? 0 : foundNearEvents.length)}))`;
	}

	protected restoreWidthOfMutatedEvents(column: HTMLElement) {
		this.mutatedOtherEventHtmlList.forEach((element, index) => {
			element.style.width = `${column.clientWidth / this.mutatedOtherEventHtmlList.length}px`;
			element.style.transform = `translateX(calc(100% * ${index}))`;
		});
	};

	private async detectParamsInQueryParams() {
		const {statuses, start} = this.activatedRoute.snapshot.queryParams;
		if (!statuses && !start) {
			this.dispatchActionToUpdateCalendar();
			return;
		}

		if (start) {

			const setDate$ = this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
				start
			}));
			await firstValueFrom(setDate$);

		}

		if (statuses) {

			this.orderServiceStatusesControl.setValue(statuses, {
				emitEvent: false,
				onlySelf: true
			});
			const updateFilters$ = this.store.dispatch(new CalendarWithSpecialistsAction.UpdateFilters({
				statuses
			}));
			await firstValueFrom(updateFilters$);

		}

		const getItems$ = this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());
		await firstValueFrom(getItems$);

	}

}
