import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DestroyRef,
	ElementRef,
	HostListener,
	inject,
	OnInit,
	QueryList,
	viewChild,
	viewChildren,
	ViewChildren,
	ViewEncapsulation
} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import CalendarWithSpecialistLocaStateService
	from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/calendar-with-specialist.loca.state.service";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom, map, switchMap, tap} from "rxjs";
import {
	CalendarWithSpecialistsQueries
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.queries";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {ActivatedRoute} from "@angular/router";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {FormControl} from "@angular/forms";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {DateTime} from "luxon";
import {RISchedule} from "@shared/domain/interface/i.schedule";
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
import { FilterCalendarWithSpecialistComponent } from "./filter/filter.calendar-with-specialist.component";
import { TranslatePipe } from "@ngx-translate/core";


@Component({
	selector: 'app-week-calendar-widget-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './week-calendar.widget.component.html',
	host: {
		class: 'flex flex-col h-full overflow-x-auto',
	},
	imports: [
		FilterCalendarWithSpecialistComponent,
		TranslatePipe,
	]
})
export class WeekCalendarWidgetComponent implements OnInit, AfterViewInit {

	public changeEventPositionIsOn = false;
	public handleChangeEventForDraggingEnabledElement = false;

	protected readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

	public readonly memberList = this.calendarWithSpecialistLocaStateService.members;

	public readonly orderServiceStatusesControl: FormControl<OrderServiceStatusEnum[]> = new FormControl<OrderServiceStatusEnum[]>([], {
		nonNullable: true
	});
	public readonly memberIdListControl: FormControl<string[]> = new FormControl<string[]>(this.memberList.map(({_id}) => _id), {
		nonNullable: true
	});

	public readonly weekdays = [
		{ number: '1', translationKey: 'weekday.long.monday' },
		{ number: '2', translationKey: 'weekday.long.tuesday' },
		{ number: '3', translationKey: 'weekday.long.wednesday' },
		{ number: '4', translationKey: 'weekday.long.thursday' },
		{ number: '5', translationKey: 'weekday.long.friday' },
		{ number: '6', translationKey: 'weekday.long.saturday' },
		{ number: '7', translationKey: 'weekday.long.sunday' }
	];

	public readonly calendar = viewChild.required<ElementRef<HTMLDivElement>>('calendar');

	public eventsBySpecialistId: {
		[specialistId: string]: {
			[weekday: string]: {
				absences: EAbsence[];
				orderServices: EOrderService[];
			}
		}
	} = {};

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
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly destroyRef = inject(DestroyRef);
	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);
	public readonly schedules$ = this.store.select(BusinessProfileState.schedules);
	public readonly isTodayS = this.store.selectSignal(CalendarWithSpecialistsQueries.isToday);
	private readonly document = inject(DOCUMENT);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly actions$ = inject(Actions);

	private readonly columns = viewChildren<ElementRef<HTMLDivElement>>('column');

	public constructor() {
		explicitEffect([this.columns], ([columns]) => {
			console.log({columns});
			let isSyncing = false;

			columns.forEach(column => {
				column.nativeElement.addEventListener('scroll', function() {
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

			this.ngxLogger.info('WeekCalendarWidgetComponent:events$: ', items);

			return items.reduce((acc, event) => {

				if (event instanceof EOrderService) {

					const {orderAppointmentDetails: {specialists, start}} = event;
					const eventDate = DateTime.fromISO(start);
					const weekday = eventDate.weekday.toString(); // 1-7 (Monday-Sunday)

					specialists.forEach((specialist) => {

						const specialistId = specialist.member._id;

						// Initialize nested structure if not exists
						if (!acc[specialistId]) {
							acc[specialistId] = {};
						}
						if (!acc[specialistId][weekday]) {
							acc[specialistId][weekday] = {
								absences: [],
								orderServices: []
							};
						}

						acc[specialistId][weekday].orderServices.push(event);

					});

				}

				if (event instanceof EAbsence) {

					const {members, entireBusiness, start} = event;
					const eventDate = DateTime.fromISO(start);
					const weekday = eventDate.weekday.toString(); // 1-7 (Monday-Sunday)

					if (entireBusiness) {

						this.calendarWithSpecialistLocaStateService.members.forEach((member) => {

							const specialistId = member._id;

							// Initialize nested structure if not exists
							if (!acc[specialistId]) {
								acc[specialistId] = {};
							}
							if (!acc[specialistId][weekday]) {
								acc[specialistId][weekday] = {
									absences: [],
									orderServices: []
								};
							}

							acc[specialistId][weekday].absences.push(structuredClone(event));

						});

					} else {

						members.forEach((member) => {

							const specialistId = member._id as string;

							// Initialize nested structure if not exists
							if (!acc[specialistId]) {
								acc[specialistId] = {};
							}
							if (!acc[specialistId][weekday]) {
								acc[specialistId][weekday] = {
									absences: [],
									orderServices: []
								};
							}

							acc[specialistId][weekday].absences.push(event);

						});

					}

				}

				return acc;

			}, {} as { 
				[specialistId: string]: {
					[weekday: string]: {
						absences: EAbsence[];
						orderServices: EOrderService[];
					}
				}
			});

		}),
		tap((eventsBySpecialistId) => {

			console.log({eventsBySpecialistId});
			

			this.eventsBySpecialistId = eventsBySpecialistId;

		})
	).subscribe();

	public get thereSomeEventCalendarWithSpecialistWidgetComponent() {
		return !!this.eventCalendarWithSpecialistWidgetComponent;
	}

	public get twoMinutesForPx() {
		return this.calendarWithSpecialistLocaStateService.oneMinuteForPx * this.calendarWithSpecialistLocaStateService.movementInMinutesControl.value;
	}

	public isEOrderService(event: EOrderService | EAbsence): event is EOrderService {
		return event instanceof EOrderService;
	}

	public isEAbsence(event: EOrderService | EAbsence): event is EAbsence {
		return event instanceof EAbsence;
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

		this.actions$
			.pipe(
				takeUntilDestroyed(this.destroyRef),
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
			takeUntilDestroyed(this.destroyRef),
		).subscribe((params) => {
			if ('statuses' in params) {
				const {statuses} = params;
				if (statuses) {
					this.orderServiceStatusesControl.setValue(statuses as OrderServiceStatusEnum[], {
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
