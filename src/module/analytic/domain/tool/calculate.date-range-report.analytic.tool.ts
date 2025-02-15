import {DateRangeReportAnalyticApi} from "@module/analytic/infrastructure/api/adapter/date-range-report.analytic.api.adapter";
import {Analytic} from "@module/analytic/infrastructure/store/date-range-report/interface/i.analytic";
import {OrderServiceStatusEnum} from "@core/business-logic/order/enum/order-service.status.enum";
import {ApplicationEnum} from "@utility/domain/enum/application.enum";
import {OrderStatusEnum} from "@core/business-logic/order/enum/order.status.enum";
import {is} from "@core/shared/checker";
import {CurrencyCodeEnum} from "@utility/domain/enum";

// Here we will calculate the date range for the report for analytic propery in store
// Припускаємо, що всі необхідні типи та енумерації вже імпортовані або визначені:

// Функція для отримання ключів енумерації
function getEnumKeys<T>(enumObj: T): (keyof T)[] {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	return Object.keys(enumObj) as (keyof T)[];
}

function getOrderServiceStatusStateWithDefaultValue<T>(defaultValue: T) {
	const isEmptyObject = is.object_empty(defaultValue);
	const dv = () => isEmptyObject ? {} : defaultValue;
	return {
		[OrderServiceStatusEnum.requested]: dv(),
		[OrderServiceStatusEnum.accepted]: dv(),
		[OrderServiceStatusEnum.inProgress]: dv(),
		[OrderServiceStatusEnum.done]: dv(),
		[OrderServiceStatusEnum.rejected]: dv(),
		[OrderServiceStatusEnum.cancelled]: dv(),
		[OrderServiceStatusEnum.deleted]: dv(),
	} as unknown as {
		-readonly [key in keyof typeof OrderServiceStatusEnum]: T;
	};
}

function getOrderStatusStateWithDefaultValue<T>(defaultValue: T) {
	const isEmptyObject = is.object_empty(defaultValue);
	const dv = () => isEmptyObject ? {} : defaultValue;
	return {
		[OrderStatusEnum.done]: dv(),
		[OrderStatusEnum.inProgress]: dv(),
		[OrderStatusEnum.rejected]: dv(),
		[OrderStatusEnum.cancelled]: dv(),
		[OrderStatusEnum.confirmed]: dv(),
		[OrderStatusEnum.draft]: dv(),
		[OrderStatusEnum.requested]: dv(),
	} as unknown as {
		-readonly [key in keyof typeof OrderStatusEnum]: T;
	};
}

function getOrderServiceStatusStateWithDefaultValueAndCurrency<T>(defaultValue: T) {
	const dv = () => getCurrencyCodeStateWithDefaultValue(defaultValue);
	return {
		[OrderServiceStatusEnum.requested]: dv(),
		[OrderServiceStatusEnum.accepted]: dv(),
		[OrderServiceStatusEnum.inProgress]: dv(),
		[OrderServiceStatusEnum.done]: dv(),
		[OrderServiceStatusEnum.rejected]: dv(),
		[OrderServiceStatusEnum.cancelled]: dv(),
		[OrderServiceStatusEnum.deleted]: dv(),
	} as unknown as {
		-readonly [key in keyof typeof OrderServiceStatusEnum]: {
			-readonly [key in keyof typeof CurrencyCodeEnum]: T;
		};
	};
}

function getCurrencyCodeStateWithDefaultValue<T>(defaultValue: T) {
	const isEmptyObject = is.object_empty(defaultValue);
	const dv = () => isEmptyObject ? {} : defaultValue;
	return {
		[CurrencyCodeEnum.UAH]: dv(),
		[CurrencyCodeEnum.USD]: dv(),
		[CurrencyCodeEnum.DKK]: dv(),
		[CurrencyCodeEnum.PLN]: dv(),
	} as unknown as {
		-readonly [key in keyof typeof CurrencyCodeEnum]: T;
	};
}

/**
 * Main class for processing analytic data
 */
class AnalyticProcessor {

	// Вхідні дані
	private response: DateRangeReportAnalyticApi.IResponse;
	// Вихідні дані
	private readonly analyticData: Analytic.I;

	private readonly createdAt: string = new Date().toISOString();

	public constructor(response: DateRangeReportAnalyticApi.IResponse) {
		this.response = response;
		this.analyticData = this.getAnalyticStructure();
	}

	// Ініціалізація початкової структури даних
	private getAnalyticStructure(): Analytic.I {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				specialists: 0,
				services: 0,
				customers: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			specialistRecord: {},
			serviceRecord: {},
			customerRecord: {},
			order: {
				record: {},
				by: {
					status: getOrderStatusStateWithDefaultValue({}),
					source: {
						[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue({}),
						[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue({})
					}
				}
			},
			orderService: {
				record: {},
				by: {
					status: getOrderServiceStatusStateWithDefaultValue({}),
					source: {
						[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue({}),
						[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue({})
					},
					wasSelectedAnybody: {}
				}
			},
			_meta: {
				createdAt: this.createdAt,
				processedAt: '',
			},
		};
	}

	private initializeProcessingDate(): void {
		this.analyticData._meta.processedAt = new Date().toISOString();
	}

	/**
	 * NOTE: #1 Main processing function
	 */
	public process(): Analytic.I {

		this.stepOne();
		this.stepTwo();
		this.stepThree();
		this.stepFour();

		this.initializeProcessingDate();
		return this.analyticData;
	}

	/**
	 * Process: Initialization global data in analytic context
	 * @private
	 */
	private stepOne(): void {

		const analyticInitializationGlobalData = new AnalyticInitializationGlobalData(this.analyticData);

		this.response.specialistReports.forEach(({dateReports, specialist}) => {

			// TODO: Add new process for products.
			dateReports.forEach(({services}) => {

				services.forEach((service) => {
					analyticInitializationGlobalData.process(service, specialist);
				});

			});

		});

	}

	/**
	 * Process: Separation
	 * @private
	 */
	private stepTwo(): void {

		const analyticSeparation = new AnalyticSeparation(this.analyticData);
		analyticSeparation.process();

	}

	private stepThree(): void {

		const analyticCalculation = new AnalyticFilter(this.analyticData);
		analyticCalculation.process();

	}

	private stepFour(): void {

		const analyticCalculation = new AnalyticCalculation(this.analyticData);
		analyticCalculation.process();

	}

}

/**
 *
 */
class AnalyticInitializationGlobalData {

	public constructor(
		private readonly analyticData: Analytic.I,
	) {
	}

	public process(
		service: DateRangeReportAnalyticApi.IService,
		specialist: DateRangeReportAnalyticApi.ISpecialist
	): void {

		/**
		 * ➡️service
		 */
		if (!this.analyticData.serviceRecord[service.serviceId]) {
			this.analyticData.serviceRecord[service.serviceId] = AnalyticDataTools.getServiceRecordStructure(service);
		}

		/**
		 * ➡️specialist
		 */
		if (!this.analyticData.specialistRecord[specialist.memberId]) {
			this.analyticData.specialistRecord[specialist.memberId] = AnalyticDataTools.getSpecialistRecordStructure(specialist);
		}

		/**
		 * ➡️order
		 */
		const orderService = this.analyticData.orderService.record[service.orderServiceId] = AnalyticDataTools.getOrderServiceRecord(service, specialist);
		let order = this.analyticData.order.record[service.orderId];
		if (!order) {
			const orderService = this.analyticData.orderService.record[service.orderServiceId] = AnalyticDataTools.getOrderServiceRecord(service, specialist);
			order = this.analyticData.order.record[service.orderId] = AnalyticDataTools.getOrderRecordStructure(orderService);
		}
		order.orderServices.push(orderService);
		const areThereAllDoneOrderServices = order.orderServices.every(({status}) => status === OrderServiceStatusEnum.done);
		const orderStatus = areThereAllDoneOrderServices ? OrderStatusEnum.done : OrderStatusEnum.inProgress;
		order.specificStatus = orderStatus;

		/**
		 * ➡️customer
		 */
		service.attendants.forEach((attendee) => {
			if (!this.analyticData.customerRecord[attendee.customerId]) {
				this.analyticData.customerRecord[attendee.customerId] = AnalyticDataTools.getCustomerRecordStructure(attendee);
			}
		});

	}

}

/**
 *
 */
class AnalyticSeparation {

	public constructor(
		private readonly analyticData: Analytic.I,
	) {
	}

	public process() {

		const base = this.analyticData;

		/**
		 * ➡️orderService
		 */
		Object.values(base.orderService.record).forEach((orderServiceRecord) => {

			/**
			 * Place to declare local variables
			 */
			const {status, id: orderServiceId, createdOn, wasSelectedAnybody} = orderServiceRecord;
			const refToGlobalOrder = base.order.record[orderServiceRecord.orderId];

			/**
			 * ✅[ORDER SERVICE]
			 * Part of: orderService
			 * Separate by: status, source and wasSelectedAnybody
			 */
			base.orderService.by.status[status][orderServiceId] = orderServiceRecord;
			base.orderService.by.source[createdOn][status][orderServiceId] = orderServiceRecord;
			if (wasSelectedAnybody) base.orderService.by.wasSelectedAnybody[orderServiceId] = orderServiceRecord;

			// -------------------------------- //

			/**
			 * ✅[SPECIALIST]
			 * Part of: specialistRecord
			 */
			const specialistCell = base.specialistRecord[orderServiceRecord.specialist.id];
			const serviceForSpecialist = AnalyticDataTools.getServiceRecordStructureForSpecialist(orderServiceRecord.service);

			if (!specialistCell.orderServiceRecord[orderServiceId]) {
				specialistCell.orderServiceRecord[orderServiceId] = orderServiceRecord;
			}

			if (!specialistCell.serviceRecord[orderServiceRecord.service.id]) {
				specialistCell.serviceRecord[orderServiceRecord.service.id] = serviceForSpecialist;
			}

			if (!specialistCell.orderRecord[orderServiceRecord.orderId]) {
				specialistCell.orderRecord[orderServiceRecord.orderId] = refToGlobalOrder;
			}

			// -------------------------------- //

			/**
			 * ✅[SERVICE]
			 * Part of: serviceRecord
			 */
			const serviceCell = base.serviceRecord[orderServiceRecord.service.id];
			const specialistForService = AnalyticDataTools.getSpecialistRecordStructureForService(orderServiceRecord.specialist);

			if (!serviceCell.orderServiceRecord[orderServiceId]) {
				serviceCell.orderServiceRecord[orderServiceId] = orderServiceRecord;
			}

			if (!serviceCell.orderRecord[orderServiceRecord.orderId]) {
				serviceCell.orderRecord[orderServiceRecord.orderId] = refToGlobalOrder;
			}

			if (!serviceCell.specialistRecord[orderServiceRecord.specialist.id]) {
				serviceCell.specialistRecord[orderServiceRecord.specialist.id] = specialistForService;
			}


			// -------------------------------- //

			/**
			 * ➡️customerRecord
			 * Part of: customerRecord
			 */
			orderServiceRecord.customers.forEach((customer) => {

				/**
				 * Place to declare local variables
				 */
				const customerCell = base.customerRecord[customer.id];

				if (!customerCell) {
					console.error(`Customer with id ${customer.id} not found in customerRecord`);
					return;
				}

				/**
				 * ✅[CUSTOMER] IN SERVICE RECORD
				 */
				if (!serviceCell.customerRecord[customer.id]) {
					serviceCell.customerRecord[customer.id] = customerCell;
				}

				/**
				 * ✅[CUSTOMER] IN SPECIALIST RECORD
				 */
				if (!specialistCell.customerRecord[customer.id]) {
					specialistCell.customerRecord[customer.id] = customerCell;
				}

				/**
				 * ✅[ORDER SERVICE] IN CUSTOMER RECORD
				 * Part of: customerRecord but for orderService
				 * Separate by: status, source and wasSelectedAnybody
				 */
				const customerOrderServiceBase = customerCell.orderService;
				customerOrderServiceBase.record[orderServiceId] = orderServiceRecord;
				customerOrderServiceBase.by.status[status][orderServiceId] = orderServiceRecord;
				customerOrderServiceBase.by.source[createdOn][status][orderServiceId] = orderServiceRecord;
				if (wasSelectedAnybody) customerOrderServiceBase.by.wasSelectedAnybody[orderServiceId] = orderServiceRecord;

				// -------------------------------- //

				/**
				 * ✅[ORDER] IN CUSTOMER RECORD
				 * Part of: customerRecord but for order
				 */
				const areThereAllDoneOrderServices = refToGlobalOrder.orderServices.every(({status}) => status === OrderServiceStatusEnum.done);
				const orderStatus = areThereAllDoneOrderServices ? OrderStatusEnum.done : OrderStatusEnum.inProgress;

				customerCell.order.record[orderServiceId] = refToGlobalOrder;
				customerCell.order.by.status[orderStatus][orderServiceId] = refToGlobalOrder;
				customerCell.order.by.source[createdOn][orderStatus][orderServiceId] = refToGlobalOrder;

				// -------------------------------- //

				/**
				 * ✅[SPECIALIST] IN CUSTOMER RECORD
				 * Part of: customerRecord but for specialist
				 */
				const specialistId = orderServiceRecord.specialist.id;
				const specialistInCustomerScope = customerCell.specialistRecord[specialistId] = AnalyticDataTools.getSpecialistRecordStructureForCustomer(orderServiceRecord.specialist);
				specialistInCustomerScope.serviceRecord[orderServiceRecord.service.id] = serviceForSpecialist;
				specialistInCustomerScope.orderRecord[orderServiceRecord.orderId] = refToGlobalOrder;
				specialistInCustomerScope.orderServiceRecord[orderServiceId] = orderServiceRecord;

				// -------------------------------- //

				/**
				 * ✅[SERVICE] IN CUSTOMER RECORD
				 * Part of: customerRecord but for service
				 */
				const serviceInCustomerScope = customerCell.serviceRecord[orderServiceRecord.service.id] = AnalyticDataTools.getServiceRecordStructureForCustomer(orderServiceRecord.service);
				serviceInCustomerScope.orderRecord[orderServiceRecord.orderId] = refToGlobalOrder;
				serviceInCustomerScope.orderServiceRecord[orderServiceId] = orderServiceRecord;
				serviceInCustomerScope.specialistRecord[specialistId] = specialistForService;

			});

		});

	}

}

/**
 * Filter analytic data
 */
class AnalyticFilter {

	public constructor(
		private readonly analyticData: Analytic.I,
	) {
	}

	public process() {

		const base = this.analyticData;

		Object.values(base.specialistRecord).forEach((specialist) => {

			Object.keys(specialist.customerRecord).forEach((customerId) => {

				const refToGlobalCustomer = specialist.customerRecord[customerId];
				const customer = specialist.customerRecord[customerId] = structuredClone(refToGlobalCustomer);

				/**
				 * START: order
				 */

				customer.order.record = {};
				customer.order.by.status = getOrderStatusStateWithDefaultValue({});
				customer.order.by.source = {
					[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue({}),
					[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue({})
				};

				Object.values(refToGlobalCustomer.order.record).forEach((order) => {

					if (customer.order.record[order.id]) {
						return;
					}

					const newOrder = customer.order.record[order.id] = structuredClone(order);
					newOrder.orderServices = [];

					customer.order.by.status[order.specificStatus][order.id] = newOrder;
					customer.order.by.source[order.source][order.specificStatus][order.id] = newOrder;

				});

				/**
				 * FINISH: order
				 */
				/**
				 * START: service
				 */

				customer.serviceRecord = {};

				Object.values(refToGlobalCustomer.serviceRecord).forEach((service) => {

					if (customer.serviceRecord[service.details.id]) {
						return;
					}

					const newService = customer.serviceRecord[service.details.id] = structuredClone(service);
					newService.orderRecord = {};
					newService.orderServiceRecord = {};

				});

				/**
				 * FINISH: service
				 */
				/**
				 * START: orderService + order + service
				 */

				customer.orderService.record = {};
				customer.orderService.by.wasSelectedAnybody = {};
				customer.orderService.by.status = getOrderServiceStatusStateWithDefaultValue({});
				customer.orderService.by.source = {
					[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue({}),
					[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue({})
				};

				Object.values(refToGlobalCustomer.orderService.record).forEach((orderService) => {

					if (orderService.specialist.id !== specialist.details.id) {
						return;
					}

					if (customer.orderService.record[orderService.id]) {
						return;
					}

					customer.orderService.record[orderService.id] = orderService;
					customer.orderService.by.status[orderService.status][orderService.id] = orderService;
					customer.orderService.by.source[orderService.createdOn][orderService.status][orderService.id] = orderService;
					if (orderService.wasSelectedAnybody) customer.orderService.by.wasSelectedAnybody[orderService.id] = orderService;

					// Add orderService to order
					customer.order.record[orderService.orderId].orderServices.push(orderService);

					// Add orderService to service
					customer.serviceRecord[orderService.service.id].orderServiceRecord[orderService.id] = orderService;
					customer.serviceRecord[orderService.service.id].orderRecord[orderService.orderId] = customer.order.record[orderService.orderId];


				});

				/**
				 * FINISH: orderService
				 */

			});

			Object.keys(specialist.serviceRecord).forEach((serviceId) => {

				const refToGlobalService = specialist.serviceRecord[serviceId];
				const service = specialist.serviceRecord[serviceId] = structuredClone(refToGlobalService);

				/**
				 * START: order
				 */

				service.orderRecord = {};

				/**
				 * FINISH: order
				 */
				/**
				 * START: service
				 */

				service.customerRecord = {};

				/**
				 * FINISH: service
				 */
				/**
				 * START: orderService + order + service
				 */

				service.orderServiceRecord = {};
				Object.values(refToGlobalService.orderServiceRecord).forEach((refToGlobalOrderService) => {

					if (refToGlobalOrderService.specialist.id !== specialist.details.id) {
						return;
					}

					if (service.orderServiceRecord[refToGlobalOrderService.id]) {
						return;
					}

					const orderService = service.orderServiceRecord[refToGlobalOrderService.id] = structuredClone(refToGlobalOrderService);

					// Add orderService to order
					service.orderRecord[orderService.orderId].orderServices.push(orderService);

					// Add orderService to customer
					orderService.customers.forEach((refToGlobalCustomer) => {

						const customer = service.customerRecord[refToGlobalCustomer.id] = structuredClone(base.customerRecord[refToGlobalCustomer.id]);

						if (!customer.orderService.record[orderService.id]) {
							customer.orderService.record[orderService.id] = orderService;
						}

						if (!customer.order.record[orderService.orderId]) {
							customer.order.record[orderService.orderId] = service.orderRecord[orderService.orderId];
						}


					});

				});

				/**
				 * FINISH: orderService
				 */

			});

			Object.keys(specialist.orderRecord).forEach((orderId) => {

				const refToGlobalOrder = specialist.orderRecord[orderId];
				const order = specialist.orderRecord[orderId] = structuredClone(refToGlobalOrder);

				/**
				 * START: orderService + service
				 */

				order.orderServices.forEach((orderService) => {

					const service = specialist.serviceRecord[orderService.service.id];

					if (!service.orderServiceRecord[orderService.id]) {
						service.orderServiceRecord[orderService.id] = orderService;
					}

					if (!service.orderRecord[orderService.orderId]) {
						service.orderRecord[orderService.orderId] = order;
					}

				});

				/**
				 * FINISH: orderService
				 */

			});

		});

	}

}

/**
 *
 */
class AnalyticCalculation {

	public constructor(
		private readonly analyticData: Analytic.I,
	) {
	}

	public process() {

		const base = this.analyticData;

		base.counter.customers = Object.keys(base.customerRecord).length;
		base.counter.services = Object.keys(base.serviceRecord).length;

		/**
		 * EACH CONTEXT
		 */

		/**
		 * OrderService context
		 */
		Object.values(base.orderService.record).forEach((orderService) => {
			base.counter.orderService.total++;
			base.counter.orderService.by.status[orderService.status]++;
			base.counter.orderService.by.source[orderService.createdOn][orderService.status]++;
			base.counter.orderService.by.wasSelectedAnybody += orderService.wasSelectedAnybody ? 1 : 0;

			base.summary.total.serviceTimeInSeconds += orderService.durationInSeconds;
			base.summary.revenue.total.by.status[orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;
			base.summary.revenue.total.by.source[orderService.createdOn][orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;

		});

		base.summary.average.serviceTimeInSeconds = base.summary.total.serviceTimeInSeconds / base.counter.orderService.total;

		/**
		 * Order context
		 */
		Object.values(base.order.record).forEach((order) => {
			base.counter.orders.total++;
			base.counter.orders.by.status[order.specificStatus]++;
			base.counter.orders.by.source[order.source][order.specificStatus]++;
		});

		Object.keys(base.summary.revenue.total.by.status).forEach((orderServiceStatus) => {

			const orderServiceStatusEnum = orderServiceStatus as OrderServiceStatusEnum;

			Object.keys(base.summary.revenue.total.by.status[orderServiceStatusEnum]).forEach((currency) => {

				const currencyEnum = currency as CurrencyCodeEnum;

				// Calculate average revenue for each order
				const totalRevenueByStatus = base.summary.revenue.total.by.status[orderServiceStatusEnum][currencyEnum];

				// TODO: Add forEach for each order status when backend will be ready for it
				const orderCountByStatus = base.counter.orders.by.status[OrderStatusEnum.done];
				base.summary.revenue.average.by.status[orderServiceStatusEnum][currencyEnum] = totalRevenueByStatus / orderCountByStatus;

				Object.keys(base.summary.revenue.total.by.source).forEach((source) => {

					const sourceEnum = source as ApplicationEnum;

					const totalRevenueBySource = base.summary.revenue.total.by.source[sourceEnum][orderServiceStatusEnum][currencyEnum];
					const orderCountBySource = base.counter.orders.by.source[sourceEnum][OrderStatusEnum.done];
					base.summary.revenue.average.by.source[sourceEnum][orderServiceStatusEnum][currencyEnum] = totalRevenueBySource / orderCountBySource;

				});

			});

		});

		/**
		 * Specialist context
		 */
		Object.values(base.specialistRecord).forEach((specialist) => {

			// Increment specialists counter
			base.counter.specialists++;

			specialist.counter.services = Object.keys(specialist.serviceRecord).length;

			Object.values(specialist.orderServiceRecord).forEach((orderService) => {

				specialist.summary.total.serviceTimeInSeconds += orderService.durationInSeconds;
				specialist.summary.revenue.total.by.status[orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;
				specialist.summary.revenue.total.by.source[orderService.createdOn][orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;

				specialist.counter.orderService.total++;
				specialist.counter.orderService.by.status[orderService.status]++;
				specialist.counter.orderService.by.source[orderService.createdOn][orderService.status]++;

			});

			specialist.summary.average.serviceTimeInSeconds = specialist.summary.total.serviceTimeInSeconds / specialist.counter.orderService.total;

			Object.keys(specialist.customerRecord).forEach((customerId) => {

				// Increment customers counter
				specialist.counter.customers++;

				const customer = specialist.customerRecord[customerId];

				Object.values(customer.orderService.record).forEach((orderService) => {

					customer.summary.total.serviceTimeInSeconds += orderService.durationInSeconds;
					customer.summary.revenue.total.by.status[orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;
					customer.summary.revenue.total.by.source[orderService.createdOn][orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;

					customer.counter.orderService.total++;
					customer.counter.orderService.by.status[orderService.status]++;
					customer.counter.orderService.by.source[orderService.createdOn][orderService.status]++;

				});

				customer.summary.average.serviceTimeInSeconds = customer.summary.total.serviceTimeInSeconds / customer.counter.orderService.total;

				Object.values(customer.order.record).forEach((order) => {

					customer.counter.orders.total++;
					customer.counter.orders.by.status[order.specificStatus]++;
					customer.counter.orders.by.source[order.source][order.specificStatus]++;

					// Calculate average revenue for each customer
					const customerRevenue = customer.summary.revenue.total.by.status[order.specificStatus];
					const customerOrdersCount = customer.counter.orders.by.status[order.specificStatus];
					const customerOrdersCountBySource = customer.counter.orders.by.source[order.source][order.specificStatus];

					Object.keys(customerRevenue).forEach((currency) => {

						const currencyEnum = currency as CurrencyCodeEnum;
						customer.summary.revenue.average.by.status[order.specificStatus][currencyEnum] = customerRevenue[currencyEnum] / customerOrdersCount;
						customer.summary.revenue.average.by.source[order.source][order.specificStatus][currencyEnum] = customerRevenue[currencyEnum] / customerOrdersCountBySource;

					});

				});

			});

			Object.values(specialist.orderRecord).forEach((order) => {

				specialist.counter.orders.total++;
				specialist.counter.orders.by.status[order.specificStatus]++;
				specialist.counter.orders.by.source[order.source][order.specificStatus]++;

				// Calculate average revenue for each specialist
				const specialistRevenue = specialist.summary.revenue.total.by.status[order.specificStatus];
				const specialistOrdersCount = specialist.counter.orders.by.status[order.specificStatus];
				const specialistOrdersCountBySource = specialist.counter.orders.by.source[order.source][order.specificStatus];


				Object.keys(specialistRevenue).forEach((currency) => {

					const currencyEnum = currency as CurrencyCodeEnum;
					specialist.summary.revenue.average.by.status[order.specificStatus][currencyEnum] = specialistRevenue[currencyEnum] / specialistOrdersCount;
					specialist.summary.revenue.average.by.source[order.source][order.specificStatus][currencyEnum] = specialistRevenue[currencyEnum] / specialistOrdersCountBySource;

				});

			});

		});

		/**
		 * Service context
		 */
		Object.values(base.serviceRecord).forEach((service) => {

			Object.values(service.orderServiceRecord).forEach((orderService) => {

				service.summary.total.serviceTimeInSeconds += orderService.durationInSeconds;
				service.summary.revenue.total.by.status[orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;
				service.summary.revenue.total.by.source[orderService.createdOn][orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;

				service.counter.orderService.total++;
				service.counter.orderService.by.status[orderService.status]++;
				service.counter.orderService.by.source[orderService.createdOn][orderService.status]++;

			});

			service.summary.average.serviceTimeInSeconds = service.summary.total.serviceTimeInSeconds / service.counter.orderService.total;

			service.counter.customers = Object.keys(service.customerRecord).length;

			Object.values(service.orderRecord).forEach((order) => {

				service.counter.orders.total++;
				service.counter.orders.by.status[order.specificStatus]++;
				service.counter.orders.by.source[order.source][order.specificStatus]++;

				// Calculate average revenue for each service
				const serviceRevenue = service.summary.revenue.total.by.status[order.specificStatus];
				const serviceOrdersCount = service.counter.orders.by.status[order.specificStatus];
				const serviceOrdersCountBySource = service.counter.orders.by.source[order.source][order.specificStatus];

				Object.keys(serviceRevenue).forEach((currency) => {

					const currencyEnum = currency as CurrencyCodeEnum;
					service.summary.revenue.average.by.status[order.specificStatus][currencyEnum] = serviceRevenue[currencyEnum] / serviceOrdersCount;
					service.summary.revenue.average.by.source[order.source][order.specificStatus][currencyEnum] = serviceRevenue[currencyEnum] / serviceOrdersCountBySource;

				});

			});

		});

		/**
		 * Customer context
		 */
		Object.values(base.customerRecord).forEach((customer) => {

			Object.values(customer.orderService.record).forEach((orderService) => {

				customer.summary.total.serviceTimeInSeconds += orderService.durationInSeconds;
				customer.summary.revenue.total.by.status[orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;
				customer.summary.revenue.total.by.source[orderService.createdOn][orderService.status][orderService.currency as CurrencyCodeEnum] += orderService.price;

				customer.counter.orderService.total++;
				customer.counter.orderService.by.status[orderService.status]++;
				customer.counter.orderService.by.source[orderService.createdOn][orderService.status]++;

			});

			customer.summary.average.serviceTimeInSeconds = customer.summary.total.serviceTimeInSeconds / customer.counter.orderService.total;

			customer.counter.specialists = Object.keys(customer.specialistRecord).length;

			Object.values(customer.order.record).forEach((order) => {

				customer.counter.orders.total++;
				customer.counter.orders.by.status[order.specificStatus]++;
				customer.counter.orders.by.source[order.source][order.specificStatus]++;

				// Calculate average revenue for each customer
				const customerRevenue = customer.summary.revenue.total.by.status[order.specificStatus];
				const customerOrdersCount = customer.counter.orders.by.status[order.specificStatus];
				const customerOrdersCountBySource = customer.counter.orders.by.source[order.source][order.specificStatus];

				Object.keys(customerRevenue).forEach((currency) => {

					const currencyEnum = currency as CurrencyCodeEnum;
					customer.summary.revenue.average.by.status[order.specificStatus][currencyEnum] = customerRevenue[currencyEnum] / customerOrdersCount;
					customer.summary.revenue.average.by.source[order.source][order.specificStatus][currencyEnum] = customerRevenue[currencyEnum] / customerOrdersCountBySource;

				});

			});

		});

	}

}

/**
 *
 */
class AnalyticDataTools {

	/**
	 * Return order record structure
	 * @param service
	 * @param specialist
	 * @private
	 */
	public static getOrderServiceRecord(service: DateRangeReportAnalyticApi.IService, specialist: DateRangeReportAnalyticApi.ISpecialist): Analytic.IOrderService {
		return {
			id: service.orderServiceId,
			orderId: service.orderId,
			price: service.price,
			currency: service.currency,
			durationInSeconds: service.durationInSeconds,
			startTime: service.startTime,
			endTime: service.endTime,
			createdOn: service.createdOn,
			wasSelectedAnybody: service.wasSelectedAnybody,
			status: service.status,
			customers: service.attendants.map((attendee) => ({
				id: attendee.customerId,
				firstName: attendee.firstName,
				lastName: attendee.lastName,
				registeredDate: attendee.registeredDate
			})),
			service: {
				id: service.serviceId,
				serviceName: service.serviceName
			},
			specialist: {
				id: specialist.memberId,
				firstName: specialist.firstName,
				lastName: specialist.lastName,
				email: specialist.email
			}
		};
	}

	/**
	 * Return service record structure
	 * @param service
	 * @private
	 */
	public static getServiceRecordStructure(service: DateRangeReportAnalyticApi.IService) {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				specialists: 0,
				customers: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: {
				id: service.serviceId,
				serviceName: service.serviceName
			},
			specialistRecord: {},
			customerRecord: {},
			orderRecord: {},
			orderServiceRecord: {}
		};
	}

	/**
	 * Return service record structure
	 * @param service
	 * @private
	 */
	public static getServiceRecordStructureForCustomer(service: Analytic.IService['details']): Omit<Analytic.IService, 'customerRecord'> {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				specialists: 0,
				customers: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: service,
			specialistRecord: {},
			orderRecord: {},
			orderServiceRecord: {}
		};
	}

	/**
	 * Return service record structure
	 * @param service
	 * @private
	 */
	public static getServiceRecordStructureForSpecialist(service: Analytic.IService['details']) {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				specialists: 0,
				customers: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: service,
			customerRecord: {},
			orderRecord: {},
			orderServiceRecord: {}
		};
	}

	/**
	 * Return specialist record structure
	 * @private
	 * @param specialist
	 */
	public static getSpecialistRecordStructure(specialist: DateRangeReportAnalyticApi.ISpecialist) {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				customers: 0,
				services: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: {
				id: specialist.memberId,
				firstName: specialist.firstName,
				lastName: specialist.lastName,
				email: specialist.email
			},
			serviceRecord: {},
			orderRecord: {},
			orderServiceRecord: {},
			customerRecord: {}
		};
	}

	/**
	 * Return specialist record structure
	 * @private
	 * @param specialist
	 */
	public static getSpecialistRecordStructureForCustomer(specialist: Analytic.ISpecialist['details']): Omit<Analytic.ISpecialist, 'customerRecord'> {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				customers: 0,
				services: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: specialist,
			serviceRecord: {},
			orderRecord: {},
			orderServiceRecord: {},
		};
	}

	/**
	 * Return specialist record structure
	 * @private
	 * @param specialist
	 */
	public static getSpecialistRecordStructureForService(specialist: Analytic.ISpecialist['details']) {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				customers: 0,
				services: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: specialist,
			customerRecord: {},
			orderRecord: {},
			orderServiceRecord: {},
		};
	}

	/**
	 * Return customer record structure
	 * @param attendant
	 * @param withoutKey
	 * @private
	 */
	public static getCustomerRecordStructure<RETURN>(attendant: DateRangeReportAnalyticApi.IAttendee, withoutKey?: keyof Analytic.ICustomer): RETURN {
		const structure = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0),
								[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
							},
							status: getOrderServiceStatusStateWithDefaultValueAndCurrency(0)
						}
					}
				},
				total: {
					serviceTimeInSeconds: 0
				},
				average: {
					serviceTimeInSeconds: 0
				}
			},
			counter: {
				specialists: 0,
				services: 0,
				orders: {
					total: 0,
					by: {
						status: getOrderStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue(0)
						}
					}
				},
				orderService: {
					total: 0,
					by: {
						status: getOrderServiceStatusStateWithDefaultValue(0),
						source: {
							[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue(0),
							[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue(0)
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: {
				id: attendant.customerId,
				firstName: attendant.firstName,
				lastName: attendant.lastName,
				registeredDate: attendant.registeredDate
			},
			specialistRecord: {},
			serviceRecord: {},
			order: {
				record: {},
				by: {
					status: getOrderStatusStateWithDefaultValue({}),
					source: {
						[ApplicationEnum.panel]: getOrderStatusStateWithDefaultValue({}),
						[ApplicationEnum.client]: getOrderStatusStateWithDefaultValue({})
					}
				}
			},
			orderService: {
				record: {},
				by: {
					status: getOrderServiceStatusStateWithDefaultValue({}),
					source: {
						[ApplicationEnum.panel]: getOrderServiceStatusStateWithDefaultValue({}),
						[ApplicationEnum.client]: getOrderServiceStatusStateWithDefaultValue({})
					},
					wasSelectedAnybody: {}
				},
			}
		};

		if (withoutKey) {
			delete structure[withoutKey];
		}

		return structure as RETURN;
	}

	/**
	 * Return order record structure
	 * @param orderService
	 */
	public static getOrderRecordStructure(orderService: Analytic.IOrderService): Analytic.IOrder {
		return {
			id: orderService.orderId,
			orderServices: [orderService],
			specificStatus: OrderStatusEnum.inProgress, // TODO: find better way!
			source: orderService.createdOn
		};
	}

}

// Експорт функції для використання зовнішніми модулями
export function transformIResponseToAnalytic(iResponse: DateRangeReportAnalyticApi.IResponse): Analytic.I {
	const processor = new AnalyticProcessor(iResponse);
	const analyticData = processor.process();
	return analyticData;
}

export function compareAnalyticObjects(a: Analytic.I, b: Analytic.I): Partial<Analytic.I> {
	// Допоміжна рекурсивна функція для глибокого порівняння

	function deepCompare(x: any, y: any): any {
		if (x === y) {
			// Якщо значення однакові, повертаємо undefined
			return undefined;
		}

		if (typeof x !== typeof y) {
			// Якщо типи різні, повертаємо обидва значення
			return {oldValue: x, newValue: y};
		}

		if (typeof x !== 'object' || x === null || y === null) {
			// Якщо це примітивні типи або null, повертаємо обидва значення
			return {oldValue: x, newValue: y};
		}

		if (Array.isArray(x) && Array.isArray(y)) {
			if (x.length !== y.length) {
				return {oldValue: x, newValue: y};
			}
			const arrayDiff = [];
			for (let i = 0; i < x.length; i++) {
				const diff = deepCompare(x[i], y[i]);
				arrayDiff.push(diff);
			}
			// Перевіряємо, чи є різниці в масиві
			return arrayDiff.some(diff => diff !== undefined) ? arrayDiff : undefined;
		}

		// Порівняння об'єктів
		const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
		const diff: any = {};
		let hasDiff = false;
		for (const key of keys) {
			const valueDiff = deepCompare(x[key], y[key]);
			if (valueDiff !== undefined) {
				diff[key] = valueDiff;
				hasDiff = true;
			}
		}
		return hasDiff ? diff : undefined;
	}

	const summaryDifferences = deepCompare(a.summary, b.summary);
	const counterDifferences = deepCompare(a.counter, b.counter);

	return {
		summary: summaryDifferences,
		counter: counterDifferences
	} as Partial<Analytic.I>;
}

// const fixtures = {
// 	week: {
// 		'9-15.09': week_91509,
// 		'16-22.09': week_162209,
// 	}
// };
// const analytic = {
// 	'9-15.09': transformIResponseToAnalytic(fixtures.week['9-15.09'] as any),
// 	'16-22.09': transformIResponseToAnalytic(fixtures.week['16-22.09'] as any)
// };
// console.log(analytic, compareAnalyticObjects(analytic['9-15.09'], analytic['16-22.09']));
