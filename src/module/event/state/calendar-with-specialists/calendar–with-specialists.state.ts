import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {IsOrganizerEnum, OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {DateTime} from "luxon";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {IAttendee_V2, IEvent_V2} from "@event/domain";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {PagedOrderApiAdapter} from "@order/external/adapter/api/paged.order.api.adapter";
import {PagedAbsenceApiAdapter} from "@absence/external/adapter/api/paged.order.api.adapter";
import {clearObject} from "@utility/domain/clear.object";

export interface ICalendarWithSpecialist {
	params: {
		start: string;
		end: string;
		page: number;
		pageSize: number;
		orderBy: OrderByEnum;
		orderDir: OrderDirEnum;
	};
	data: IEvent_V2[];
	loader: boolean;
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
		},
		data: [],
		loader: false,
	},
})
@Injectable()
export class CalendarWithSpecialistsState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly pagedOrderApiAdapter = inject(PagedOrderApiAdapter);
	private readonly pagedAbsenceApiAdapter = inject(PagedAbsenceApiAdapter);
	private readonly router = inject(Router);

	@Action(CalendarWithSpecialistsAction.GetItems)
	public async getItems(ctx: StateContext<ICalendarWithSpecialist>) {

		const {params, loader} = ctx.getState();

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

		const absenceParams = {
			...params
		};

		if ('status' in absenceParams) {
			delete absenceParams.status;
		}

		const {0: orderPaged, 1: absencePaged} = await Promise.all([
			this.pagedOrderApiAdapter.executeAsync(orderParams),
			this.pagedAbsenceApiAdapter.executeAsync(absenceParams),
		]);

		const data: IEvent_V2[] = [
			...orderPaged.items.reduce((acc, order) => {
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

					// Check if appointment start is in the correct range
					if (DateTime.fromISO(service.orderAppointmentDetails.start).hasSame(DateTime.fromISO(params.start), 'day') === false) {
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
			...absencePaged.items.map((absence) => {
				return {
					is: 'absence',
					_id: absence._id,
					updatedAt: absence.updatedAt,
					createdAt: absence.createdAt,
					start: absence.start,
					end: absence.end,
					note: absence.note,
					entireBusiness: absence.entireBusiness,
					attendees: absence.memberIds.map((attendee) => {
						return {
							isOrganizer: IsOrganizerEnum.NO,
							is: 'specialist',
							originalData: attendee,
							_id: attendee
						} as IAttendee_V2;
					}),
					originalData: absence,
				} as IEvent_V2;
			})
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
