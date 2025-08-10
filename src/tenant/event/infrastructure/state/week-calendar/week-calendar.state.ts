import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {DateTime} from "luxon";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {clearObject} from "@shared/domain/clear.object";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {StateEnum} from "@core/shared/enum/state.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import EOrderService from "@tenant/order/order-service/domain/entity/e.order-service";
import EAbsence from "@tenant/member/absence/domain/entity/e.absence";
import { WeekCalendarAction } from "./week-calendar.action";
import { IntervalTypeEnum } from "@src/tenant/analytic/domain/enum/interval.enum";

export interface IWeekCalendarState {
	params: {
		start: string;
		interval: IntervalTypeEnum;
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

@State<IWeekCalendarState>({
	name: 'weekCalendar',
	defaults: {
		params: {
			start: DateTime.now().startOf('week').toJSDate().toISOString(),
			interval: IntervalTypeEnum.week,
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
export class WeekCalendarActionState {

	private readonly ngxLogger = inject(NGXLogger);
	private readonly sharedUow = inject(SharedUow);
	private readonly router = inject(Router);

	@Action(WeekCalendarAction.GetItems)
	public async getItems(ctx: StateContext<IWeekCalendarState>) {

		const {params, loader, settings} = ctx.getState();

		if (loader) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.getItems', 'Loader is already active', params);
			return;
		}

		ctx.patchState({
			loader: true,
		});

		const {interval, ...orderParams} = params;

		const end = DateTime.fromISO(params.start).plus({ [interval]: 1 }).endOf('day').toJSDate().toISOString();

		const absences = await this.sharedUow.absence.findByRange(params.start, end);

		const orders = await this.sharedUow.order.findByServicesRangeAndStatuses(params.start, end, params.statuses);

		this.ngxLogger.debug('CalendarWithSpecialistsState.getItems', 'Orders found', orders.length, 'Absences found', absences.length);

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
						!(service.orderAppointmentDetails.start >= params.start && service.orderAppointmentDetails.start < end) &&
						!(service.orderAppointmentDetails.end > params.start && service.orderAppointmentDetails.end <= end) &&
						!(service.orderAppointmentDetails.start < params.start && service.orderAppointmentDetails.end > end)
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

	@Action(WeekCalendarAction.UpdateFilters)
	public async updateFilters(ctx: StateContext<IWeekCalendarState>, {payload}: WeekCalendarAction.UpdateFilters) {
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

	@Action(WeekCalendarAction.NextDate)
	public async nextDate(ctx: StateContext<IWeekCalendarState>) {

		const {params} = ctx.getState();

		ctx.dispatch(new WeekCalendarAction.SetDate({
			start: DateTime.fromISO(params.start).plus({days: 1}).startOf('day').toJSDate().toISOString(),
			interval: params.interval
		}));

		ctx.dispatch(new WeekCalendarAction.GetItems());

	}

	@Action(WeekCalendarAction.PrevDate)
	public async prevDate(ctx: StateContext<IWeekCalendarState>) {

		const {params} = ctx.getState();

		ctx.dispatch(new WeekCalendarAction.SetDate({
			start: DateTime.fromISO(params.start).minus({days: 1}).startOf('day').toJSDate().toISOString(),
			interval: params.interval
		}));

		ctx.dispatch(new WeekCalendarAction.GetItems());

	}

	@Action(WeekCalendarAction.SetDate)
	public async setDate(ctx: StateContext<IWeekCalendarState>, {payload}: WeekCalendarAction.SetDate) {

		const {start, interval} = payload;

		const {params} = ctx.getState();

		// Check if it is a new date
		if (DateTime.fromISO(start).hasSame(DateTime.fromISO(params.start), 'day')) {
			this.ngxLogger.warn('CalendarWithSpecialistsState.setDate', 'Same date', start, params.start);
			return;
		}

		const end = DateTime.fromISO(start).plus({[interval]: 1}).endOf('day').toJSDate().toISOString();

		const newParams = {
			...params,
			start: DateTime.fromISO(start).startOf('day').toJSDate().toISOString(),
			end,
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
