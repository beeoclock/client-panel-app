import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {IsOrganizerEnum, OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {DateTime} from "luxon";
import {
	CalendarWithSpecialistsAction
} from "@event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {IAttendee_V2, IEvent_V2} from "@event/domain";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {clearObject} from "@utility/domain/clear.object";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {StateEnum} from "@core/shared/enum/state.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";

export interface ICalendarWithSpecialist {
	params: {
		start: string;
		end: string;
		page: number;
		pageSize: number;
		orderBy: OrderByEnum;
		orderDir: OrderDirEnum;
		statuses: OrderServiceStatusEnum[];
	};
	data: IEvent_V2[];
	loader: boolean;
	settings: {
		startTime: string; // 00:00 - 23:59 Local time
		endTime: string; // 00:00 - 23:59 Local time
	}
}

@State<ICalendarWithSpecialist>({
	name: 'calendarWithSpecialists',
	defaults: {
		params: {
			start: DateTime.now().startOf('day').toJSDate().toISOString(),
			end: DateTime.now().endOf('day').toJSDate().toISOString(),
			page: 1,
			pageSize: 1000,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
			statuses: [
				OrderServiceStatusEnum.done,
				OrderServiceStatusEnum.inProgress,
				OrderServiceStatusEnum.accepted,
				OrderServiceStatusEnum.requested,
			]
		},
		data: [],
		loader: false,
		settings: {
			startTime: '00:00', // 00:00 - 23:59 Local time
			endTime: '23:59', // 00:00 - 23:59 Local time
		}
	},
})
@Injectable()
export class CalendarWithSpecialistsState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);
	private readonly router = inject(Router);

	@Action(CalendarWithSpecialistsAction.GetItems)
	public async getItems(ctx: StateContext<ICalendarWithSpecialist>) {

		const {params, loader, settings} = ctx.getState();

		if (loader) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.getItems', 'Loader is already active', params);
			return;
		}

		ctx.patchState({
			loader: true,
		});

		const orderParams = {
			...params
		};

		const absences = await this.sharedUow.absence.findByRange(params.start, params.end);

		const orders = await this.sharedUow.order.findByServicesRangeAndStatuses(params.start, params.end, params.statuses);

		const {startTime, endTime} = settings;

		const data: IEvent_V2[] = [
			...orders.reduce((acc, order) => {
				if (order.services.length === 0) {
					return acc;
				}

				order.services.forEach((service) => {

					// Check if the order is in the correct status
					if ('status' in orderParams) {
						if (service.status !== orderParams.status) {
							return;
						}
					}

					if (!orderParams.statuses.includes(service.status)) {
						return;
					}

					/**
					 * Check if the service is in the correct state
					 */
					if (service.state !== StateEnum.active) {
						return;
					}

					const start = DateTime.fromISO(service.orderAppointmentDetails.start);

					// Check if appointment start is in the correct range
					if (start.hasSame(DateTime.fromISO(params.start), 'day') === false) {
						return;
					}

					const end = DateTime.fromISO(service.orderAppointmentDetails.end);

					const serviceStartTime = start.toFormat('HH:mm');
					const serviceEndTime = end.toFormat('HH:mm');

					if (serviceEndTime < serviceStartTime) {
						return;
					}

					if (serviceStartTime < startTime && serviceEndTime < startTime) {
						return;
					}

					if (serviceStartTime > endTime && serviceEndTime > endTime) {
						return;
					}

					const attendees = service.orderAppointmentDetails?.specialists.map((specialist) => {
						return {
							_id: specialist.member._id,
							isOrganizer: IsOrganizerEnum.NO,
							is: 'specialist',
							originalData: specialist,
						} as IAttendee_V2;
					});

					service.orderAppointmentDetails?.attendees.forEach((attendee) => {
						attendees.push({
							_id: attendee._id,
							isOrganizer: IsOrganizerEnum.NO,
							is: 'customer',
							originalData: attendee,
						} as IAttendee_V2);
					});

					acc.push({
						is: 'order',
						_id: service._id,
						updatedAt: order.updatedAt,
						createdAt: order.createdAt,
						start: service.orderAppointmentDetails.start,
						end: service.orderAppointmentDetails.end,
						note: service.customerNote,
						entireBusiness: false,
						attendees,
						originalData: {order, service},
					} as IEvent_V2);
				});

				return acc;

			}, [] as IEvent_V2[]),
			...absences.reduce((acc, absence) => {

				const start = DateTime.fromISO(absence.start);
				const end = DateTime.fromISO(absence.end);

				const absenceStartTime = start.toFormat('HH:mm');
				const absenceEndTime = end.toFormat('HH:mm');

				if (absenceEndTime < absenceStartTime) {
					return acc;
				}

				if (absenceStartTime < startTime && absenceEndTime < startTime) {
					return acc;
				}

				if (absenceStartTime > endTime && absenceEndTime > endTime) {
					return acc;
				}

				acc.push({
					is: 'absence',
					_id: absence._id,
					updatedAt: absence.updatedAt,
					createdAt: absence.createdAt,
					start: absence.start,
					end: absence.end,
					note: absence.note,
					entireBusiness: absence.entireBusiness,
					attendees: absence.members.map((attendee) => {
						return {
							isOrganizer: IsOrganizerEnum.NO,
							is: 'specialist',
							originalData: attendee,
							_id: attendee._id
						} as IAttendee_V2;
					}),
					originalData: absence,
				});

				return acc;

			}, [] as IEvent_V2[])
		];

		ctx.patchState({
			loader: false,
			data,
		});

	}

	@Action(CalendarWithSpecialistsAction.UpdateFilters)
	public async updateFilters(ctx: StateContext<ICalendarWithSpecialist>, {payload}: CalendarWithSpecialistsAction.UpdateFilters) {
		const {params} = ctx.getState();
		const newParams = {
			...params,
			...payload,
		};

		await this.router.navigate([], {
			queryParams: newParams,
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});

		clearObject(newParams);
		ctx.patchState({
			params: newParams,
		});

	}

	@Action(CalendarWithSpecialistsAction.NextDate)
	public async nextDate(ctx: StateContext<ICalendarWithSpecialist>) {

		const {params} = ctx.getState();

		ctx.dispatch(new CalendarWithSpecialistsAction.SetDate({
			start: DateTime.fromISO(params.start).plus({days: 1}).startOf('day').toJSDate().toISOString()
		}));

		ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());

	}

	@Action(CalendarWithSpecialistsAction.PrevDate)
	public async prevDate(ctx: StateContext<ICalendarWithSpecialist>) {

		const {params} = ctx.getState();

		ctx.dispatch(new CalendarWithSpecialistsAction.SetDate({
			start: DateTime.fromISO(params.start).minus({days: 1}).startOf('day').toJSDate().toISOString()
		}));

		ctx.dispatch(new CalendarWithSpecialistsAction.GetItems());

	}

	@Action(CalendarWithSpecialistsAction.SetDate)
	public async setDate(ctx: StateContext<ICalendarWithSpecialist>, {payload}: CalendarWithSpecialistsAction.SetDate) {

		const {start} = payload;

		const {params} = ctx.getState();

		// Check if it is a new date
		if (DateTime.fromISO(start).hasSame(DateTime.fromISO(params.start), 'day')) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.setDate', 'Same date', start, params.start);
			return;
		}

		const newParams = {
			...params,
			start: DateTime.fromISO(start).startOf('day').toJSDate().toISOString(),
			end: DateTime.fromISO(start).endOf('day').toJSDate().toISOString(),
		};

		ctx.patchState({
			params: newParams
		});

		await this.router.navigate([], {
			queryParams: newParams,
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});

	}

}
