import {
	afterNextRender,
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	HostListener,
	inject,
	input,
	OnInit,
	QueryList,
	signal,
	viewChild,
	viewChildren,
	ViewChildren,
	ViewEncapsulation
} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/calendar-with-specialist.loca.state.service";
import {NGXLogger} from "ngx-logger";
import {combineLatest, delay, filter, firstValueFrom, iif, map, of, switchMap, tap} from "rxjs";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {FormControl} from "@angular/forms";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {
	EventCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/event.calendar-with-specialist.widget.component";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {explicitEffect} from "ngxtension/explicit-effect";
import {FilterCalendarWithSpecialistComponent} from "./filter/filter.calendar-with-specialist.component";
import {
	EmptySlotCalendarWithSpecialistWidgetComponent
} from "../elements-on-calendar/empty-slot.calendar-with-specialist.widget.component";
import {HeaderCalendarWithSpecialistWidgetComponent} from "../header.calendar-with-specialist.widget.component";
import {TimeLineCalendarWithSpecialistWidgetComponent} from "../time-line.calendar-with-specialist.widget.component";
import {is} from "@core/shared/checker";
import {ISchedule, RISchedule} from "@shared/domain/interface/i.schedule";
import {MemberDataState} from "@tenant/member/member/infrastructure/state/data/member.data.state";
import {ITableState} from "@shared/domain/table.state";
import {IMember} from "@tenant/member/member/domain";
import {MemberProfileStatusEnum} from "@tenant/member/member/domain/enums/member-profile-status.enum";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";


@Component({
	selector: 'app-calendar-with-specialists-widget-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar-with-specialist.widget.component.html',
	host: {
		class: 'flex flex-col h-full overflow-x-auto',
	},
	imports: [
		FilterCalendarWithSpecialistComponent,
		EventCalendarWithSpecialistWidgetComponent,
		EmptySlotCalendarWithSpecialistWidgetComponent,
		HeaderCalendarWithSpecialistWidgetComponent,
		TimeLineCalendarWithSpecialistWidgetComponent
	]
})
export class CalendarWithSpecialistWidgetComponent implements OnInit, AfterViewInit {

	public readonly start = input<string>();
	public readonly statuses = input<OrderServiceStatusEnum[]>();

	public changeEventPositionIsOn = false;
	public handleChangeEventForDraggingEnabledElement = false;

	protected readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly destroyRef = inject(DestroyRef);
	public readonly isTodayS = this.store.selectSignal(CalendarWithSpecialistsQueries.isToday);
	private readonly document = inject(DOCUMENT);
	private readonly actions$ = inject(Actions);

	public readonly memberList = this.calendarWithSpecialistLocaStateService.members;

	public readonly orderServiceStatusesControl: FormControl<OrderServiceStatusEnum[]> = new FormControl<OrderServiceStatusEnum[]>([], {
		nonNullable: true
	});
	public readonly memberIdListControl: FormControl<string[]> = new FormControl<string[]>([], {
		nonNullable: true
	});

	public readonly tableStateSubscription = this.store.select(MemberDataState.tableState).pipe(
		takeUntilDestroyed(),
		// If tableState is empty then wait one second and try call initMemberList use iif and delay
		switchMap((tableState) => {
			return iif(
				() => tableState.total === 0,
				of(tableState).pipe(
					delay(1_000),
					tap(() => this.initMemberList())
				),
				of(tableState)
			);
		}),
		filter(is.object_not_empty<ITableState<IMember.EntityRaw>>),
		filter((tableState) => tableState.total > 0),
		tap((tableState) => {
			const members = tableState.items.filter((member: IMember.EntityRaw) => member.profileStatus === MemberProfileStatusEnum.active);
			this.memberList.set(members);
			this.memberIdListControl.setValue(members.map(({_id}) => _id));
			this.dispatchActionToUpdateCalendar();
		})
	).subscribe();

	@Dispatch()
	private initMemberList() {
		return new MemberDataActions.GetList()
	}

	public readonly itemSubscription = this.store.select(BusinessProfileState.item).pipe(
		takeUntilDestroyed(),
		filter(is.object_not_empty),
		switchMap((item) => combineLatest([
			this.store.select(BusinessProfileState.earliestScheduleAndLatestSchedule).pipe(
				filter(is.not_null_or_undefined<{ earliestSchedule: RISchedule; latestSchedule: RISchedule; }>),
				tap(({earliestSchedule, latestSchedule}) => {

					this.calendarWithSpecialistLocaStateService.earliestScheduleInSeconds.set(earliestSchedule.startInSeconds);
					this.calendarWithSpecialistLocaStateService.latestScheduleInSeconds.set(latestSchedule.endInSeconds);

				})
			),
			this.store.select(BusinessProfileState.schedules).pipe(
				filter(is.not_null_or_undefined<ISchedule[]>),
				tap((schedules) => {
					this.calendarWithSpecialistLocaStateService.schedules.set(schedules);
				})
			)
		]).pipe(map(() => item))),
		tap((item) => {
			this.dispatchActionToUpdateCalendar();
		})
	).subscribe();

	public readonly calendar = viewChild.required<ElementRef<HTMLDivElement>>('calendar');

	public readonly eventsBySpecialistIdS = signal<{
		[key: string]: (EAbsence | EOrderService)[]
	}>({})

	// Find all #column
	@ViewChildren('column')
	public columnList!: QueryList<ElementRef<HTMLDivElement>>;

	public eventCalendarWithSpecialistWidgetComponent: EventCalendarWithSpecialistWidgetComponent | null = null;

	private mutatedOtherEventHtmlList: HTMLDivElement[] = [];
	private mouseDown = false;
	private prevMousePosition = {x: 0, y: 0};
	private whatIsDragging: 'position' | 'top' | 'bottom' | null = null;

	private readonly moveCallback = {
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

	private readonly columns = viewChildren<ElementRef<HTMLDivElement>>('column');

	private readonly actionsSubscription = this.actions$
		.pipe(
			takeUntilDestroyed(),
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

	public constructor() {
		afterNextRender(() => {

			// TODO: fix problem with query params

			const start = this.start();
			const statuses = this.statuses();
			console.log({start})
			console.log({statuses})
			if (statuses?.length) {

				this.orderServiceStatusesControl.setValue(statuses, {
					emitEvent: false,
					onlySelf: true
				});
				this.store.dispatch(new CalendarWithSpecialistsAction.UpdateFilters({
					statuses
				}));

			}

			if (start?.length) {

				this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
					start
				}));

			}
		});
		explicitEffect([this.columns], ([columns]) => {
			let isSyncing = false;

			columns.forEach(column => {
				column.nativeElement.addEventListener('scroll', function () {
					if (isSyncing) return;

					isSyncing = true;
					const scrollTop = this.scrollTop;

					columns.forEach(otherColumn => {
						if (otherColumn !== column) {
							otherColumn.nativeElement.scrollTop = scrollTop;
						}
					});

					isSyncing = false;
				});
			});

		})
	}

	private readonly eventsSubscription = this.store.select(CalendarWithSpecialistsQueries.data).pipe(
		takeUntilDestroyed(),
		map((items) => {

			this.ngxLogger.info('CalendarWithSpecialistWidgetComponent:events$: ', items);

			return items.reduce((acc, event) => {

				if (event instanceof EOrderService) {

					const {orderAppointmentDetails: {specialists}} = event;

					specialists.forEach((specialist) => {

						const specialistId = specialist.member._id;

						acc[specialistId] = acc[specialistId] || [];

						acc[specialistId].push(event);

					});

				}

				if (event instanceof EAbsence) {

					const {members, entireBusiness} = event;

					if (entireBusiness) {

						this.memberList().forEach((member) => {

							const {_id: specialistId} = member;

							acc[specialistId] = acc[specialistId] || [];

							acc[specialistId].push(structuredClone(event));

						});

					} else {

						members.forEach((member) => {

							const specialistId = member._id as string;

							acc[specialistId] = acc[specialistId] || [];

							// Push event into specialist's list and filter out other specialists but keep customers
							acc[specialistId].push(event);

						});

					}

				}

				return acc;

			}, {} as { [key: string]: (EAbsence | EOrderService)[] });

		}),
		tap((eventsBySpecialistId) => {

			this.eventsBySpecialistIdS.set(eventsBySpecialistId);
			setTimeout(() => {
				this.columnList.forEach((column) => {
					this.findAndFixNearEventsWidthInEachColumn(column);
				});
			}, 0);

		})
	).subscribe();

	public get thereSomeEventCalendarWithSpecialistWidgetComponent() {
		return !!this.eventCalendarWithSpecialistWidgetComponent;
	}

	public get twoMinutesForPx() {
		return this.calendarWithSpecialistLocaStateService.oneMinuteForPx * this.calendarWithSpecialistLocaStateService.movementInMinutesControl.value;
	}

	public ngOnInit() {

		this.ngxLogger.info('CalendarWithSpecialistWidgetComponent: ngOnInit');

		this.calendarWithSpecialistLocaStateService.eventCalendarWithSpecialistWidgetComponent$.pipe(
			takeUntilDestroyed(this.destroyRef),
		).subscribe((eventCalendarWithSpecialistWidgetComponent) => {
			this.initListenersFor(eventCalendarWithSpecialistWidgetComponent);
		});

		this.store.select(CalendarWithSpecialistsQueries.params).pipe(
			takeUntilDestroyed(this.destroyRef),
		).subscribe((params) => {
			if ('statuses' in params) {
				const {statuses} = params;
				if (statuses) {
					this.orderServiceStatusesControl.setValue(statuses, {
						emitEvent: false,
						onlySelf: true
					});
				}
			}
		});

		this.orderServiceStatusesControl.valueChanges.pipe(
			takeUntilDestroyed(this.destroyRef),
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
			takeUntilDestroyed(this.destroyRef),
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
						const columnBody = column.nativeElement.querySelector('[data-column-body]');
						if (!columnBody) return;
						columnBody.appendChild(htmlDivElement);
						this.eventCalendarWithSpecialistWidgetComponent?.changeMember(this.memberList()[Number(newIndex) - 1]);
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

		if (!this.mouseDown) return;
		if (!target) return;
		if (!this.changeEventPositionIsOn) return;

		const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef?.nativeElement;

		if (!htmlDivElement) return;
		const columnIndex = target.dataset.index;

		if (!columnIndex) return;
		if (htmlDivElement.dataset.columnIndex === columnIndex) return;

		// Move event to another column
		// Move HTML element to another column

		const column = this.document.querySelector(`[data-index="${columnIndex}"]`);
		if (!column) return;
		const columnBody = column.querySelector('[data-column-body]');
		if (!columnBody) return;
		columnBody.appendChild(htmlDivElement);
		const index = Number(columnIndex) - 1;
		const member = this.memberList()[index];
		this.eventCalendarWithSpecialistWidgetComponent?.changeMember(member);

	}

	public mouseEnter($event: MouseEvent | TouchEvent) {
		const {target} = $event as unknown as MouseEvent & { target: HTMLElement }

		if (!this.mouseDown) return;
		if (!target) return;
		if (!this.changeEventPositionIsOn) return;

		const htmlDivElement = this.eventCalendarWithSpecialistWidgetComponent?.elementRef?.nativeElement;

		if (!htmlDivElement) return;
		const columnIndex = target.dataset.index;

		if (!columnIndex) return;
		if (htmlDivElement.dataset.columnIndex === columnIndex) return;

		// Move event to another column
		// Move HTML element to another column

		const column = this.document.querySelector(`[data-index="${columnIndex}"]`);
		if (!column) return;
		const columnBody = column.querySelector('[data-column-body]');
		if (!columnBody) return;
		columnBody.appendChild(htmlDivElement);
		// Change data-column-index attribute
		if (this.eventCalendarWithSpecialistWidgetComponent) {

			const index = Number(columnIndex) - 1;
			const member = this.memberList()[index];
			this.eventCalendarWithSpecialistWidgetComponent?.changeMember(member);

		}
	}

	public onFocus($event: FocusEvent) {
		// Handle focus event for accessibility - could add visual indicators or similar functionality
		// This is a placeholder to satisfy accessibility requirements
		console.debug('Calendar column focused', $event.target);
	}

	public onFocusIn($event: FocusEvent) {
		// Handle focusin event for accessibility - could add visual indicators or similar functionality
		// This is a placeholder to satisfy accessibility requirements
		console.debug('Calendar column focusin', $event.target);
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
			htmlDivElement.style.width = 'calc(100% - 20px)';
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

			elm.style.width = `calc(${column.clientWidth / (foundNearEvents.length + 1)}px - ${20 / (foundNearEvents.length + 1)}px)`;
			elm.style.transform = `translateX(calc(100% * ${index + (htmlDivElementHasSmollerTop ? 1 : 0)}))`
		});

		htmlDivElement.style.width = `calc(${column.clientWidth / (foundNearEvents.length + 1)}px - ${20 / (foundNearEvents.length + 1)}px)`;
		htmlDivElement.style.transform = `translateX(calc(100% * ${(htmlDivElementHasSmollerTop ? 0 : foundNearEvents.length)}))`;
	}

	protected restoreWidthOfMutatedEvents(column: HTMLElement) {
		this.mutatedOtherEventHtmlList.forEach((element, index) => {
			element.style.width = `calc(${column.clientWidth / this.mutatedOtherEventHtmlList.length}px - ${20 / this.mutatedOtherEventHtmlList.length}px)`;
			element.style.transform = `translateX(calc(100% * ${index}))`;
		});
	};

}
