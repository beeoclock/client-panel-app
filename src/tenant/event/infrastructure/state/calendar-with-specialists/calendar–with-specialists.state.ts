import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {DateTime} from "luxon";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {clearObject} from "@shared/domain/clear.object";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {StateEnum} from "@core/shared/enum/state.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";

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
	data: (EOrderService | EAbsence)[];
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

		const data: (EAbsence | EOrderService)[] = [
			...orders.reduce((acc, order) => {

				if (order.services.length === 0) {
					return acc;
				}

				if (order.state !== StateEnum.active) {
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

					if (
						!(service.orderAppointmentDetails.start >= params.start && service.orderAppointmentDetails.start < params.end) &&
						!(service.orderAppointmentDetails.end > params.start && service.orderAppointmentDetails.end <= params.end) &&
						!(service.orderAppointmentDetails.start < params.start && service.orderAppointmentDetails.end > params.end)
					) {
						return;
					}

					acc.push(EOrderService.fromDTO(service));
				});

				return acc;

			}, [] as EOrderService[]),
			...absences.reduce((acc, absence) => {

				if (absence.state !== StateEnum.active) {
					return acc;
				}

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

				acc.push(EAbsence.fromRaw(absence));

				return acc;

			}, [] as EAbsence[])
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

		const {start, end} = payload;

		const {params} = ctx.getState();

		// Check if it is a new date
		if (DateTime.fromISO(start).hasSame(DateTime.fromISO(params.start), 'day')) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.setDate', 'Same date', start, params.start);
			return;
		}

		const newParams = {
			...params,
			start: DateTime.fromISO(start).startOf('day').toJSDate().toISOString(),
			end: end ? DateTime.fromISO(end).endOf('day').toJSDate().toISOString() : DateTime.fromISO(start).endOf('day').toJSDate().toISOString(),
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
