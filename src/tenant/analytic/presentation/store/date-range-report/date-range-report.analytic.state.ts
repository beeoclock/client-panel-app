import {inject, Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {NGXLogger} from "ngx-logger";
import {firstValueFrom} from "rxjs";
import {AppActions} from "@shared/state/app/app.actions";
import {
	DateRangeReportAnalyticApi,
} from "@tenant/analytic/infrastructure/data-source/api/adapter/date-range-report.analytic.api.adapter";
import {
	DateRangeReportAnalyticActions
} from "@tenant/analytic/presentation/store/date-range-report/date-range-report.analytic.actions";
import {DateTime} from "luxon";
import {transformIResponseToAnalytic} from "@tenant/analytic/domain/tool/calculate.date-range-report.analytic.tool";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";
import {IHistoryV2} from "@shared/domain";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {IOrderServiceDto} from "@tenant/order/order/domain/interface/i.order-service.dto";
import {ApplicationEnum} from "@core/shared/enum/application.enum";
import {Analytic} from "@tenant/analytic/presentation/store/date-range-report/interface/i.analytic";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {StateEnum} from "@core/shared/enum/state.enum";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";

export type IDateRangeAnalyticState = {
	filterState: {
		interval: IntervalTypeEnum;
		selectedDate: string;
		specialistIds: string[];
	};
	response: DateRangeReportAnalyticApi.IResponse | null;
	analytic: Analytic.I | null;
};

@State<IDateRangeAnalyticState>({
	name: 'dateRangeReportAnalytic',
	defaults: {
		filterState: {
			interval: IntervalTypeEnum.day,
			selectedDate: DateTime.now().toJSDate().toISOString(),
			specialistIds: [] as string[],
		},
		response: null,
		analytic: null,
	},
})
@Injectable()
export class DateRangeReportAnalyticState {

	protected readonly sharedUow = inject(SharedUow);
	private readonly ngxLogger = inject(NGXLogger);

	// API

	@Action(DateRangeReportAnalyticActions.UpdateQueryParams)
	public UpdateQueryParams(ctx: StateContext<IDateRangeAnalyticState>, {payload}: DateRangeReportAnalyticActions.UpdateQueryParams) {

		ctx.patchState({
			filterState: payload
		})

	}

	@Action(DateRangeReportAnalyticActions.GetList)
	public async getList(ctx: StateContext<IDateRangeAnalyticState>): Promise<void> {

		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(true)));

		const state = ctx.getState();

		try {

			const {
				specialistIds,
				selectedDate,
				interval
			} = state.filterState;

			const startDateTime = DateTime.fromISO(selectedDate).startOf(interval).toJSDate().toISOString();
			const endDateTime = DateTime.fromISO(selectedDate).endOf(interval).toJSDate().toISOString();

			// const orderQuery = this.orderIndexedDBFacade.source.find({
			// 	$and: [
			// 		{
			// 			$or: [
			// 				/**
			// 				 * Ми не можемо брати в розрахунок для статистики ті замовлення які почались, але не
			// 				 * закінчились в вказаному періоді, тому що скорше за все що ми ще не отримали дохід,
			// 				 * про те взагалі ми повинні якось правильно порахувати дохід і все інше за вказаний
			// 				 * період, але по змінених статусах, тобто Клієнт А створив замовлення в казаний період:
			// 				 *
			// 				 * Приклад №1: оплатив у вказаний період значить статус оплачений має враховуватись в дохід
			// 				 * 				за вказний період, і взагалі не брати в розрахунок статуси замовленої послуги
			// 				 * 				таким чином, ми вірно вирахуємо коли саму був дохід і який саме.
			// 				 *
			// 				 * Приклад №2: оплатив після вказаного періоду значить статус оплачений не має враховуватись,
			// 				 * 				таким чином ми вірно вирахуємо коли саму був дохід і який саме.
			// 				 *
			// 				 * Виходить з вище вказаного те що ми зараз не вірно рахуємо дохід, ми відштовхуємось від
			// 				 * статусу замовленої послуги або статусу замовлення, а маємо відштовхуватись від того коли
			// 				 * саме Клієнт А заплатив за замовлення, тобто виходить що потрібно брати в розрахунок саме
			// 				 * PaymentDto де вказана реальна дата оплати та сума, а не статус замовлення. Бо клієнт може
			// 				 * оплатити частинами.
			// 				 */
			// 				// {
			// 				// 	'services.orderAppointmentDetails.start': {
			// 				// 		$gte: startDateTime,
			// 				// 		$lte: endDateTime,
			// 				// 	},
			// 				// },
			// 				{
			// 					'services.orderAppointmentDetails.end': {
			// 						$gte: startDateTime,
			// 						$lte: endDateTime,
			// 					}
			// 				},
			// 				{
			// 					'services.orderAppointmentDetails.start': {
			// 						$lt: startDateTime,
			// 					},
			// 					'services.orderAppointmentDetails.end': {
			// 						$gt: endDateTime,
			// 					}
			// 				}
			// 			]
			// 		},
			// 		...(specialistIds.length ? [
			// 			{
			// 				'services.orderAppointmentDetails.specialists.member._id': {
			// 					$in: specialistIds
			// 				}
			// 			}
			// 		] : [])
			// 	]
			// }, {
			// 	sort: {
			// 		createdAt: -1
			// 	}
			// });

			// const orders = orderQuery.fetch();

			const orders = await this.sharedUow.order.db.filter((order) => {

				if (order.state === StateEnum.deleted) return false;
				if (order.status === OrderStatusEnum.deleted) return false;

				return order.services.some((service) => {

					if (service.state === StateEnum.deleted) return false;
					if (service.status === OrderServiceStatusEnum.deleted) return false;

					if (specialistIds.length) {

						const result = service.orderAppointmentDetails.specialists.some((specialist) => {
							return specialistIds.includes(specialist.member._id);
						});

						if (!result) {
							return false;
						}

					}

					if (service.orderAppointmentDetails.end >= startDateTime && service.orderAppointmentDetails.end <= endDateTime) {
						return true;
					}

					if (service.orderAppointmentDetails.start < startDateTime && service.orderAppointmentDetails.end > endDateTime) {
						return true;
					}

					if (service.orderAppointmentDetails.start >= startDateTime && service.orderAppointmentDetails.end <= endDateTime) {
						return true;
					}

					return false;

				});

			}).toArray();

			// Convert orders into response DateRangeReportAnalyticApi.IResponse
			const response: DateRangeReportAnalyticApi.IResponse = {

				specialistReports: orders.reduce((acc, order) => {

					const specialist = order.services[0].orderAppointmentDetails.specialists[0];
					const {
						services,
						// products
					} = order;

					const totalRevenue = this.calculateTotalRevenue(services);

					const report: DateRangeReportAnalyticApi.ISpecialistReport = {
						specialist: {
							memberId: specialist.member._id,
							firstName: specialist.member.firstName,
							lastName: specialist.member.lastName,
							email: specialist.member.email,
						},
						startDate: startDateTime,
						endDate: endDateTime,
						totalRevenue,
						dateReports: this.generateDateReports(services),
					};

					const foundSpecialistReport = acc.find(specialistReport => specialistReport.specialist.memberId === specialist.member._id);

					if (foundSpecialistReport) {

						report.dateReports.forEach(dateReport => {
							const foundDateReport = foundSpecialistReport.dateReports.find(dateReportFound => dateReportFound.date === dateReport.date);
							if (foundDateReport) {
								foundDateReport.services.push(...dateReport.services);
								// foundDateReport.products.push(...dateReport.products);
								foundDateReport.dateRevenue += dateReport.dateRevenue;
							} else {
								foundSpecialistReport.dateReports.push(dateReport);
							}
						});
						// foundSpecialistReport.dateReports.push(...report.dateReports);
						foundSpecialistReport.totalRevenue += report.totalRevenue;

					} else {

						acc.push(report);

					}

					return acc;

				}, [] as DateRangeReportAnalyticApi.ISpecialistReport[]),
				totalOrderServices: orders.reduce((acc, order) => {
					return acc + order.services.length;
				}, 0),
				totalOrders: orders.length,
				totalRevenue: orders.reduce((acc, order) => {
					return acc + order.services.reduce((acc, service) => {
						return acc + service.serviceSnapshot.durationVersions[0].prices[0].price;
					}, 0);
				}, 0),
				startDate: startDateTime,
				endDate: endDateTime,
			}
			const analytic = transformIResponseToAnalytic(response);

			ctx.patchState({
				response,
				analytic
			});

		} catch (e) {
			this.ngxLogger.error(e);
		}

		// Switch of page loader
		await firstValueFrom(ctx.dispatch(new AppActions.PageLoading(false)));

	}

	// Selectors

	@Selector()
	public static response(state: IDateRangeAnalyticState) {
		return state.response;
	}

	@Selector()
	public static filterState(state: IDateRangeAnalyticState) {
		return state.filterState;
	}

	@Selector()
	public static analytic(state: IDateRangeAnalyticState) {
		return state.analytic;
	}

	private calculateDateRevenue(
		services: DateRangeReportAnalyticApi.IService[],
		// products: IProductInfo[]
	): number {
		const serviceRevenue = services.reduce((sum, service) =>
			sum + service.price, 0);
		// const productRevenue = products.reduce((sum, product) => sum + product.price, 0);
		// return serviceRevenue + productRevenue;
		return serviceRevenue;
	}

	private calculateTotalRevenue(
		services: IOrderServiceDto[],
		// products: IOrderProductDto[]
	): number {
		const serviceRevenue = services.reduce((sum, service) =>
			sum + service.serviceSnapshot.durationVersions[0].prices[0].price, 0);
		// const productRevenue = products.reduce((sum, product) => sum + product.productSnapshot.price, 0);
		// return serviceRevenue + productRevenue;
		return serviceRevenue;
	}


	private generateDateReports(services: IOrderServiceDto[]): DateRangeReportAnalyticApi.IDateReport[] {
		const dateServiceMap = this.groupServicesByDate(services);
		// const dateProductMap = this.groupProductsByDate(products);
		const allDates = new Set([
			...Object.keys(dateServiceMap),
			// ...Object.keys(dateProductMap)
		]);

		return Array.from(allDates).map(date => {
			const servicesForDate = dateServiceMap[date] || [];
			// const productsForDate = dateProductMap[date] || [];
			const dateRevenue = this.calculateDateRevenue(
				servicesForDate,
				// productsForDate
			);

			return {
				_id: null,
				date,
				dateRevenue,
				services: servicesForDate,
				products: [],
			};
		});
	}

	private groupServicesByDate(services: IOrderServiceDto[]): {
		[key: string]: DateRangeReportAnalyticApi.IService[]
	} {
		return services.reduce((map, orderService) => {
			const serviceDate = orderService.orderAppointmentDetails.start.split('T')[0];
			const serviceInfo: DateRangeReportAnalyticApi.IService = {
				orderServiceId: orderService._id,
				orderId: orderService.orderId,
				serviceId: orderService.serviceSnapshot._id,
				status: orderService.status,
				serviceName: orderService.serviceSnapshot.languageVersions[0]?.title || '',
				price: orderService.serviceSnapshot.durationVersions[0]?.prices[0]?.price || 0,
				currency: orderService.serviceSnapshot.durationVersions[0]?.prices[0]?.currency,
				durationInSeconds: orderService.serviceSnapshot.durationVersions[0]?.durationInSeconds || 0,
				startTime: orderService.orderAppointmentDetails?.start,
				attendants: orderService.orderAppointmentDetails?.attendees
					.filter(attendant => attendant?.customer?.customerType !== CustomerTypeEnum.anonymous) // Filter out anonymous attendants
					.map(attendant => ({
						customerId: attendant?.customer?._id || '',
						firstName: attendant?.customer?.firstName ?? '',
						lastName: attendant?.customer?.lastName ?? '',
						registeredDate: attendant?.customer?.createdAt,
					})) || [],
				endTime: orderService.orderAppointmentDetails?.end,
				createdOn: (orderService.meta?.history as IHistoryV2[])?.[0]?.issuer?.type === 'customer' ? ApplicationEnum.client : ApplicationEnum.panel,
				wasSelectedAnybody: orderService.orderAppointmentDetails?.specialists[0]?.wasSelectedAnybody || false,
			};
			map[serviceDate] = map[serviceDate] || [];
			map[serviceDate].push(serviceInfo);
			return map;
		}, {} as { [key: string]: DateRangeReportAnalyticApi.IService[] });
	}


	// private groupProductsByDate(products: IOrderProductDto[]): { [key: string]: DateRangeReportAnalyticApi.IProduct[] } {
	// 	return products.reduce((map, product) => {
	// 		const productDate = product.saleDate.split('T')[0];
	// 		const productInfo: IProductInfo = {
	// 			orderId: product._id,
	// 			orderProductId: product._id,
	// 			sku: product.productSnapshot.sku,
	// 			price: product.productSnapshot.price?.value || 0,
	// 			saleDate: product.saleDate,
	// 		};
	// 		map[productDate] = map[productDate] || [];
	// 		map[productDate].push(productInfo);
	// 		return map;
	// 	}, {} as { [key: string]: IProductInfo[] });
	// }

}
