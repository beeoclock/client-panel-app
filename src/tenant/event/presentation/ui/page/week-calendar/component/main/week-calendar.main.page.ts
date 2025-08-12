import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	inject,
	OnInit,
	Signal,
	viewChild,
	viewChildren,
	ViewEncapsulation
} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom, map, switchMap} from "rxjs";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {ActivatedRoute} from "@angular/router";
import {FormControl} from "@angular/forms";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {DateTime, WeekdayNumbers} from "luxon";
import {AbsenceDataActions} from "@tenant/member/absence/infrastructure/state/data/absence.data.actions";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import {explicitEffect} from "ngxtension/explicit-effect";
import {TranslatePipe} from "@ngx-translate/core";
import {WeekDaysEnum} from "@core/shared/enum";
import {
	OrderEventWeekCalendarWidgetComponent
} from "@tenant/event/presentation/ui/page/week-calendar/component/elements-on-calendar/order-service.event.week-calendar.widget.component";
import {
	AbsenceEventWeekCalendarComponent
} from "@tenant/event/presentation/ui/page/week-calendar/component/elements-on-calendar/absence.event.week-calendar.component";
import {
	EmptySlotWeekCalendarWidgetComponent
} from "@tenant/event/presentation/ui/page/week-calendar/component/elements-on-calendar/empty-slot.week-calendar.widget.component";
import WeekCalendarLocaStateService from "../../week-calendar.local.state.service";
import { WeekCalendarQueries } from "@src/tenant/event/infrastructure/state/week-calendar/week-calendar.queries";
import { WeekCalendarAction } from "@src/tenant/event/infrastructure/state/week-calendar/week-calendar.action";
import { IntervalTypeEnum } from "@src/tenant/analytic/domain/enum/interval.enum";
import { FilterCalendarWithSpecialistComponent } from "./filter/filter.week-calendar.component";


@Component({
	selector: 'app-week-calendar-widget-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './week-calendar.main.page.html',
	host: {
		class: 'flex flex-col h-full overflow-x-auto',
	},
	imports: [
    TranslatePipe,
    OrderEventWeekCalendarWidgetComponent,
    AbsenceEventWeekCalendarComponent,
    EmptySlotWeekCalendarWidgetComponent,
    FilterCalendarWithSpecialistComponent
]
})
export class WeekCalendarMainPage implements OnInit, AfterViewInit {


	protected readonly weekCalendarStateService = inject(WeekCalendarLocaStateService);

	public readonly memberList = this.weekCalendarStateService.members;

	public readonly orderServiceStatusesControl: FormControl<OrderServiceStatusEnum[]> = new FormControl<OrderServiceStatusEnum[]>([], {
		nonNullable: true
	});
	public readonly memberIdListControl: FormControl<string[]> = new FormControl<string[]>(this.memberList.map(({_id}) => _id), {
		nonNullable: true
	});

	public readonly weekdays = [
		{number: '1', translationKey: 'weekday.long.monday'},
		{number: '2', translationKey: 'weekday.long.tuesday'},
		{number: '3', translationKey: 'weekday.long.wednesday'},
		{number: '4', translationKey: 'weekday.long.thursday'},
		{number: '5', translationKey: 'weekday.long.friday'},
		{number: '6', translationKey: 'weekday.long.saturday'},
		{number: '7', translationKey: 'weekday.long.sunday'}
	];

	public readonly calendar = viewChild.required<ElementRef<HTMLDivElement>>('calendar');

	private readonly ngxLogger = inject(NGXLogger);
	private readonly store = inject(Store);
	private readonly destroyRef = inject(DestroyRef);
	public readonly selectedDateS = this.store.selectSignal(WeekCalendarQueries.start);
	public readonly schedules$ = this.store.select(BusinessProfileState.schedules);
	public readonly isToday$ = this.store.selectSignal(WeekCalendarQueries.isToday);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly actions$ = inject(Actions);

	private readonly columns = viewChildren<ElementRef<HTMLDivElement>>('column');

	public constructor() {
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

	private readonly events$ = this.store.select(WeekCalendarQueries.data).pipe(
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
								items: [],
							};
						}

						acc[specialistId][weekday].items.push(event);

					});

				}

				if (event instanceof EAbsence) {

					const {members, entireBusiness, start} = event;
					const eventDate = DateTime.fromISO(start);
					const weekday = eventDate.weekday.toString(); // 1-7 (Monday-Sunday)

					if (entireBusiness) {

						this.weekCalendarStateService.members.forEach((member) => {

							const specialistId = member._id;

							// Initialize nested structure if not exists
							if (!acc[specialistId]) {
								acc[specialistId] = {};
							}
							if (!acc[specialistId][weekday]) {
								acc[specialistId][weekday] = {
									items: [],
								};
							}

							acc[specialistId][weekday].items.push(structuredClone(event));

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
									items: [],
								};
							}

							acc[specialistId][weekday].items.push(event);

						});

					}

				}

				return acc;

			}, {} as {
				[specialistId: string]: {
					[weekday: string]: {
						items: (EAbsence | EOrderService)[];
					}
				}
			});

		}),
		map((eventsByDateAndSpecialistId) => {
			// Sort at each day at each specialist events by start date
			Object.keys(eventsByDateAndSpecialistId).forEach(specialistId => {
				Object.keys(eventsByDateAndSpecialistId[specialistId]).forEach(weekday => {
					const {items} = eventsByDateAndSpecialistId[specialistId][weekday];

					items.sort((a, b) => {
						const aStart = a instanceof EOrderService ? DateTime.fromISO(a.orderAppointmentDetails.start) : DateTime.fromISO(a.start);
						const bStart = b instanceof EOrderService ? DateTime.fromISO(b.orderAppointmentDetails.start) : DateTime.fromISO(b.start);
						return aStart.toMillis() - bStart.toMillis();
					})
				});
			});
			return eventsByDateAndSpecialistId;
		})
	);

	public readonly eventsByDateAndSpecialistIdS: Signal<{
		[specialistId: string]: {
			[weekday: string]: {
				items: (EAbsence | EOrderService)[];
			}
		}
	}> = toSignal(this.events$, {
		initialValue: {},
	});

	public isEOrderService(event: EOrderService | EAbsence): event is EOrderService {
		return event instanceof EOrderService;
	}

	public isEAbsence(event: EOrderService | EAbsence): event is EAbsence {
		return event instanceof EAbsence;
	}

	public getStartIso(items: (EOrderService | EAbsence)[], weekday: string): string {
		if (!items.length) {
			const startOfWeek = this.selectedDateS();
			const parsedWeekday = parseInt(weekday, 10) as WeekdayNumbers | undefined;
			if (!parsedWeekday) {
				throw new Error(`Invalid weekday: ${weekday}`);
			}
			const startOfDay = startOfWeek.set({weekday: parsedWeekday});
			
			// Get business work hours for this weekday
			const schedules = this.store.selectSnapshot(BusinessProfileState.schedules);
			const daySchedule = schedules?.find(schedule => 
				schedule.workDays?.includes(parsedWeekday as WeekDaysEnum)
			);
			
			if (daySchedule && daySchedule.startInSeconds !== undefined) {
				// Convert seconds to hours, minutes, and seconds
				const totalSeconds = daySchedule.startInSeconds;
				const hours = Math.floor(totalSeconds / 3600);
				const minutes = Math.floor((totalSeconds % 3600) / 60);
				const seconds = totalSeconds % 60;
				
				const startOfDayWithBusinessHours = startOfDay.set({
					hour: hours,
					minute: minutes,
					second: seconds,
					millisecond: 0
				});
				return startOfDayWithBusinessHours.toJSDate().toISOString();
			}
			
			// Fallback to start of day if no schedule found
			return startOfDay.toJSDate().toISOString();
		}

		const end = items[0] instanceof EOrderService ? items[0].orderAppointmentDetails.end : items[0].end;
		const endDateTime = DateTime.fromISO(end);

		return endDateTime.toJSDate().toISOString();
	}

	public ngOnInit() {

		this.ngxLogger.info('WeekCalendarMainPageComponent: ngOnInit');

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

		this.store.select(WeekCalendarQueries.params).pipe(
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
					new WeekCalendarAction.UpdateFilters({
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
		firstValueFrom(this.store.select(WeekCalendarQueries.data)).then((data) => {
			if (!data.length) {
				this.dispatchActionToUpdateCalendar();
			}
		});

	}

	@Dispatch()
	public dispatchActionToUpdateCalendar() {
		return new WeekCalendarAction.GetItems();
	}

	private async detectParamsInQueryParams() {
		const {statuses, start} = this.activatedRoute.snapshot.queryParams;
		if (!statuses && !start) {
			this.dispatchActionToUpdateCalendar();
			return;
		}

		if (start) {

			const setDate$ = this.store.dispatch(new WeekCalendarAction.SetDate({
				start,
				interval: IntervalTypeEnum.week
			}));
			await firstValueFrom(setDate$);

		}

		if (statuses) {

			this.orderServiceStatusesControl.setValue(statuses, {
				emitEvent: false,
				onlySelf: true
			});
			const updateFilters$ = this.store.dispatch(new WeekCalendarAction.UpdateFilters({
				statuses
			}));
			await firstValueFrom(updateFilters$);

		}

		const getItems$ = this.store.dispatch(new WeekCalendarAction.GetItems());
		await firstValueFrom(getItems$);

	}

}
