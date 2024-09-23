import {DateRangeReportAnalyticApi} from "@module/analytic/external/api/adapter/date-range-report.analytic.api.adapter";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {ApplicationEnum} from "@utility/domain/enum/application.enum";

// Here we will calculate the date range for the report for analytic propery in store
// Припускаємо, що всі необхідні типи та енумерації вже імпортовані або визначені:

// Функція для отримання ключів енумерації
function getEnumKeys<T>(enumObj: T): (keyof T)[] {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	return Object.keys(enumObj) as (keyof T)[];
}

function getStatusNumberState() {
	return {
		[OrderServiceStatusEnum.requested]: 0,
		[OrderServiceStatusEnum.accepted]: 0,
		[OrderServiceStatusEnum.inProgress]: 0,
		[OrderServiceStatusEnum.done]: 0,
		[OrderServiceStatusEnum.rejected]: 0,
		[OrderServiceStatusEnum.cancelled]: 0,
		[OrderServiceStatusEnum.deleted]: 0,
	};
}

// Клас для обробки аналітичних даних
class AnalyticProcessor {
	// Вхідні дані
	private iResponse: DateRangeReportAnalyticApi.IResponse;
	// Вихідні дані
	private readonly analyticData: Analytic.I;

	// Множини для збереження унікальних ідентифікаторів
	private uniqueSpecialists = new Set<string>();
	private uniqueServices = new Set<string>();
	private uniqueCustomers = new Set<string>();
	private uniqueOrders = new Set<string>();

	// Змінні для обчислення середніх значень
	private totalServiceTime = 0;
	private totalServiceCount = 0;

	private readonly createdAt: string = new Date().toISOString();

	public constructor(iResponse: DateRangeReportAnalyticApi.IResponse) {
		this.iResponse = iResponse;
		this.analyticData = this.initializeAnalyticData();
	}

	// Ініціалізація початкової структури даних
	private initializeAnalyticData(): Analytic.I {
		return {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					}
				},
				total: {
					serviceTime: 0
				},
				average: {
					serviceTime: 0
				}
			},
			counter: {
				specialists: 0,
				services: 0,
				customers: 0,
				orders: {
					total: 0
				},
				orderService: {
					total: 0,
					by: {
						status: getStatusNumberState(),
						source: {
							[ApplicationEnum.panel]: getStatusNumberState(),
							[ApplicationEnum.client]: getStatusNumberState()
						},
						wasSelectedAnybody: 0
					}
				}
			},
			specialistRecord: {},
			serviceRecord: {},
			customerRecord: {},
			orderRecord: {},
			orderService: {
				record: {},
				by: {
					status: {
						[OrderServiceStatusEnum.requested]: {},
						[OrderServiceStatusEnum.accepted]: {},
						[OrderServiceStatusEnum.inProgress]: {},
						[OrderServiceStatusEnum.done]: {},
						[OrderServiceStatusEnum.rejected]: {},
						[OrderServiceStatusEnum.cancelled]: {},
						[OrderServiceStatusEnum.deleted]: {},
					},
					source: {
						[ApplicationEnum.panel]: {},
						[ApplicationEnum.client]: {}
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

	// Ініціалізація запису спеціаліста
	private initializeSpecialistRecord(specialistId: string, specialistReport: DateRangeReportAnalyticApi.ISpecialistReport): void {
		this.analyticData.specialistRecord[specialistId] = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					}
				},
				total: {
					serviceTime: 0
				},
				average: {
					serviceTime: 0
				}
			},
			counter: {
				customers: 0,
				services: 0,
				orders: {
					total: 0
				},
				orderService: {
					total: 0,
					by: {
						status: getStatusNumberState(),
						source: {
							[ApplicationEnum.panel]: getStatusNumberState(),
							[ApplicationEnum.client]: getStatusNumberState()
						},
						wasSelectedAnybody: 0
					}
				}
			},
			details: {
				id: specialistReport.specialist.memberId,
				firstName: specialistReport.specialist.firstName,
				lastName: specialistReport.specialist.lastName,
				email: specialistReport.specialist.email
			},
			serviceRecord: {},
			orderRecord: {},
			orderServiceRecord: {},
			customerRecord: {}
		};
	}

	// Ініціалізація запису сервісу
	private initializeServiceRecord(serviceId: string, service: DateRangeReportAnalyticApi.IService): void {
		this.analyticData.serviceRecord[serviceId] = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					}
				},
				total: {
					serviceTime: 0
				},
				average: {
					serviceTime: 0
				}
			},
			counter: {
				specialists: 0,
				customers: 0,
				orders: {
					total: 0
				},
				orderService: {
					total: 0,
					by: {
						status: getStatusNumberState(),
						source: {
							[ApplicationEnum.panel]: getStatusNumberState(),
							[ApplicationEnum.client]: getStatusNumberState()
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

	// Ініціалізація запису клієнта
	private getCustomerRecordStructure<RETURN>(attendant: DateRangeReportAnalyticApi.IAttendee, withoutKey?: keyof Analytic.ICustomer): RETURN {
		const structure = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: getStatusNumberState(),
								[ApplicationEnum.client]: getStatusNumberState()
							},
							status: getStatusNumberState()
						}
					}
				},
				total: {
					serviceTime: 0
				},
				average: {
					serviceTime: 0
				}
			},
			counter: {
				specialists: 0,
				services: 0,
				orders: {
					total: 0
				},
				orderService: {
					total: 0,
					by: {
						status: getStatusNumberState(),
						source: {
							[ApplicationEnum.panel]: getStatusNumberState(),
							[ApplicationEnum.client]: getStatusNumberState()
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
			orderRecord: {},
			orderServiceRecord: {}
		};

		if (withoutKey) {
			delete structure[withoutKey];
		}

		return structure as RETURN;
	}

	private initializeProcessingDate(): void {
		this.analyticData._meta.processedAt = new Date().toISOString();
	}

	/**
	 * NOTE: #1
	 * Основний метод для обробки даних
	 */
	public process(): Analytic.I {

		// Обробка кожного звіту спеціаліста
		for (const specialistReport of this.iResponse.specialistReports) {
			this.processSpecialistReport(specialistReport);
		}

		// Обчислення середніх значень після збору всіх даних
		this.calculateAverages();
		this.calculateTotal();

		this.initializeProcessingDate();

		return this.analyticData;
	}

	/**
	 * NOTE: #2
	 * Обробка звіту спеціаліста
	 * @param specialistReport
	 * @private
	 */
	private processSpecialistReport(specialistReport: DateRangeReportAnalyticApi.ISpecialistReport): void {
		const specialistId = specialistReport.specialist.memberId;

		// Додавання унікального спеціаліста
		if (!this.uniqueSpecialists.has(specialistId)) {
			this.uniqueSpecialists.add(specialistId);
		}

		// Ініціалізація запису спеціаліста, якщо він ще не існує
		if (!this.analyticData.specialistRecord[specialistId]) {
			this.initializeSpecialistRecord(specialistId, specialistReport);
		}

		const specialistData = this.analyticData.specialistRecord[specialistId];

		// Обробка звітів за датами
		for (const dateReport of specialistReport.dateReports) {
			this.processDateReport(dateReport, specialistData);
		}
	}

	/**
	 * NOTE: #2.1
	 * Обробка звіту за датою
	 * @param dateReport
	 * @param specialistData
	 * @private
	 */
	private processDateReport(dateReport: DateRangeReportAnalyticApi.IDateReport, specialistData: Analytic.ISpecialist): void {
		// Обробка кожного сервісу в звіті за датою
		for (const orderService of dateReport.services) {
			this.processService(orderService, specialistData);
		}
	}

	/**
	 * NOTE: #2.1.1
	 * Обробка сервісу
	 * @param orderService
	 * @param specialistData
	 * @private
	 */
	private processService(orderService: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist): void {
		// Оновлення лічильників загальної кількості сервісів
		specialistData.counter.orderService.total++;

		// Declaring section
		const {durationInSeconds, wasSelectedAnybody} = orderService;
		const status = orderService.status as keyof typeof OrderServiceStatusEnum;
		const source = orderService.createdOn as keyof typeof ApplicationEnum;

		// Оновлення лічильників за статусом
		this.analyticData.counter.orderService.by.status[status]++;
		specialistData.counter.orderService.by.status[status]++;

		// Оновлення лічильників за джерелом
		this.analyticData.counter.orderService.by.source[source][status]++;
		specialistData.counter.orderService.by.source[source][status]++;

		// Оновлення лічильника wasSelectedAnybody
		if (wasSelectedAnybody) {
			this.analyticData.counter.orderService.by.wasSelectedAnybody++;
			specialistData.counter.orderService.by.wasSelectedAnybody++;
		}

		// Оновлення загального доходу
		this.analyticData.summary.revenue.total.by.status[status] += orderService.price;
		this.analyticData.summary.revenue.total.by.source[source][status] += orderService.price;
		specialistData.summary.revenue.total.by.status[status] += orderService.price;
		specialistData.summary.revenue.total.by.source[source][status] += orderService.price;

		// Оновлення часу сервісу
		this.totalServiceTime += durationInSeconds;
		this.totalServiceCount++;
		this.analyticData.summary.total.serviceTime += durationInSeconds;
		specialistData.summary.total.serviceTime += durationInSeconds;

		// Обробка запису orderService
		const orderServiceId = orderService.orderServiceId;
		if (!this.analyticData.orderService.record[orderServiceId]) {
			this.processOrderService(orderService, specialistData);
		}
	}

	/**
	 * NOTE: #2.1.1.1
	 * Обробка orderService
	 * @param service
	 * @param specialistData
	 * @private
	 */
	private processOrderService(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist): void {
		// Обробка клієнтів, пов'язаних з сервісом
		const customers = service.attendants.map(attendant => {
			return this.processCustomer(this.analyticData.customerRecord, attendant, service, specialistData);
		});

		// Обробка сервісу в контексті загальної аналітики
		this.processServiceRecord(service, specialistData);

		// Обробка замовлення
		this.processOrder(service, specialistData, customers);
	}

	/**
	 * NOTE: #2.1.1.1.1
	 * Обробка клієнта
	 * @param customerRecord
	 * @param attendant
	 * @param service
	 * @param specialistData
	 * @private
	 */
	private processCustomer(
		customerRecord: {
			[customerId: string]: Analytic.ICustomer;
		},
		attendant: DateRangeReportAnalyticApi.IAttendee,
		service: DateRangeReportAnalyticApi.IService,
		specialistData: Analytic.ISpecialist
	): Analytic.ICustomer {
		const customerId = attendant.customerId;

		// Ініціалізація запису клієнта, якщо він ще не існує
		if (!customerRecord[customerId]) {
			this.uniqueCustomers.add(customerId);
			this.analyticData.customerRecord[customerId] = this.getCustomerRecordStructure<Analytic.ICustomer>(attendant);
		}

		const customerData = customerRecord[customerId];

		// Оновлення лічильників клієнта
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		const source = service.createdOn as keyof typeof ApplicationEnum;
		const duration = service.durationInSeconds;

		customerData.counter.orderService.total++;
		customerData.counter.orderService.by.status[status]++;
		customerData.counter.orderService.by.source[source][status]++;
		if (service.wasSelectedAnybody) {
			customerData.counter.orderService.by.wasSelectedAnybody++;
		}

		// Оновлення доходу та часу сервісу клієнта
		customerData.summary.revenue.total.by.status[status] += service.price;
		customerData.summary.revenue.total.by.source[source][status] += service.price;
		customerData.summary.total.serviceTime += duration;

		// Додавання записів спеціаліста до клієнта
		customerData.specialistRecord[specialistData.details.id] = specialistData;
		customerData.counter.orders.total = customerData.orderRecord ? Object.keys(customerData.orderRecord).length : 0;

		return customerData;
	}

	/**
	 * NOTE: #2.1.1.1.1.1
	 * Обробка клієнта
	 * @param customerRecord
	 * @param attendant
	 * @param service
	 * @private
	 */
	private processCustomerForSpecialist(
		customerRecord: {
			[customerId: string]: Omit<Analytic.ICustomer, 'specialistRecord'>;
		},
		attendant: DateRangeReportAnalyticApi.IAttendee,
		service: DateRangeReportAnalyticApi.IService,
	): void {
		const customerId = attendant.customerId;

		// Ініціалізація запису клієнта, якщо він ще не існує
		if (!customerRecord[customerId]) {
			const newCustomerRecordStructure = this.getCustomerRecordStructure<Omit<Analytic.ICustomer, 'specialistRecord'>>(attendant, 'specialistRecord');
			customerRecord[customerId] = newCustomerRecordStructure;
		}

		const customerData = customerRecord[customerId];

		// Оновлення лічильників клієнта
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		const source = service.createdOn as keyof typeof ApplicationEnum;
		const duration = service.durationInSeconds;

		customerData.counter.orderService.total++;
		customerData.counter.orderService.by.status[status]++;
		customerData.counter.orderService.by.source[source][status]++;
		if (service.wasSelectedAnybody) {
			customerData.counter.orderService.by.wasSelectedAnybody++;
		}

		const orderServiceData = this.getOrderServiceRecord(service);

		if (!customerData.orderRecord[service.orderId]) {
			customerData.orderRecord[service.orderId] = {
				id: service.orderId,
				orderService: [orderServiceData]
			};
		} else {
			customerData.orderRecord[service.orderId].orderService.push(orderServiceData);
		}

		customerData.orderServiceRecord[service.orderServiceId] = orderServiceData;
		customerData.serviceRecord[service.serviceId] = this.analyticData.serviceRecord[service.serviceId];

		// Додавання записів спеціаліста до клієнта
		customerData.counter.orders.total = customerData.orderRecord ? Object.keys(customerData.orderRecord).length : 0;

		// Оновлення доходу та часу сервісу клієнта
		const totalByStatus = customerData.summary.revenue.total.by.status[status] += service.price;
		const totalBySourceAndStatus = customerData.summary.revenue.total.by.source[source][status] += service.price;

		// TODO: Add for orders.total also .by.status and .by.source
		customerData.summary.revenue.average.by.status[status] = totalByStatus / customerData.counter.orders.total;
		customerData.summary.revenue.average.by.source[source][status] = totalBySourceAndStatus / customerData.counter.orders.total;
		customerData.summary.total.serviceTime += duration;

		customerRecord[customerId] = customerData;
	}

	/**
	 * NOTE: #2.1.1.1.2
	 * Обробка запису сервісу
	 * @param service
	 * @param specialistData
	 * @private
	 */
	private processServiceRecord(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist): void {
		const serviceId = service.serviceId;

		// Ініціалізація запису сервісу, якщо він ще не існує
		if (!this.analyticData.serviceRecord[serviceId]) {
			this.uniqueServices.add(serviceId);
			this.initializeServiceRecord(serviceId, service);
		}

		const serviceData = this.analyticData.serviceRecord[serviceId];

		// Оновлення лічильників сервісу
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		const source = service.createdOn as keyof typeof ApplicationEnum;
		const duration = service.durationInSeconds;

		serviceData.counter.orderService.total++;
		serviceData.counter.orderService.by.status[status]++;
		serviceData.counter.orderService.by.source[source][status]++;
		if (service.wasSelectedAnybody) {
			serviceData.counter.orderService.by.wasSelectedAnybody++;
		}

		// Оновлення доходу та часу сервісу
		serviceData.summary.revenue.total.by.status[status] += service.price;
		serviceData.summary.revenue.total.by.source[source][status] += service.price;
		serviceData.summary.total.serviceTime += duration;

		// Додавання записів спеціаліста до сервісу
		serviceData.specialistRecord[specialistData.details.id] = specialistData;

		// Додавання записів клієнтів до сервісу
		for (const attendee of service.attendants) {
			serviceData.customerRecord[attendee.customerId] = this.analyticData.customerRecord[attendee.customerId];
			this.processCustomerForSpecialist(specialistData.customerRecord, attendee, service);
		}
	}

	/**
	 * NOTE: #2.1.1.1.3
	 * Обробка замовлення
	 * @param service
	 * @param specialistData
	 * @param customers
	 * @private
	 */
	private processOrder(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist, customers: Analytic.ICustomer[]): void {
		const orderId = service.orderId;

		// Додавання унікального замовлення
		if (!this.uniqueOrders.has(orderId)) {
			this.uniqueOrders.add(orderId);
			specialistData.counter.orders.total++;

			// Ініціалізація запису замовлення
			this.analyticData.orderRecord[orderId] = {
				id: orderId,
				orderService: []
			};
		}

		// Додавання orderService до замовлення
		const orderServiceData = this.getOrderServiceRecord(service);

		this.analyticData.orderRecord[orderId].orderService.push(orderServiceData);

		// Додавання запису orderService
		this.analyticData.orderService.record[service.orderServiceId] = orderServiceData;

		// Оновлення записів спеціаліста
		specialistData.orderRecord[orderId] = this.analyticData.orderRecord[orderId];
		specialistData.orderServiceRecord[service.orderServiceId] = orderServiceData;
		specialistData.serviceRecord[service.serviceId] = this.analyticData.serviceRecord[service.serviceId];

		// Оновлення записів сервісу
		const serviceData = this.analyticData.serviceRecord[service.serviceId];
		serviceData.orderRecord[orderId] = this.analyticData.orderRecord[orderId];
		serviceData.orderServiceRecord[service.orderServiceId] = orderServiceData;

		// Оновлення записів клієнтів
		for (const customerDetail of orderServiceData.customers) {
			const customerData = this.analyticData.customerRecord[customerDetail.id];
			customerData.orderRecord[orderId] = this.analyticData.orderRecord[orderId];
			customerData.orderServiceRecord[service.orderServiceId] = orderServiceData;
			customerData.serviceRecord[service.serviceId] = serviceData;
			customerData.specialistRecord[specialistData.details.id] = specialistData;
		}

		// Оновлення orderService.by.status
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		this.analyticData.orderService.by.status[status][service.orderServiceId] = orderServiceData;

		// Оновлення orderService.by.source
		const source = service.createdOn as keyof typeof ApplicationEnum;
		this.analyticData.orderService.by.source[source][service.orderServiceId] = orderServiceData;

		// Оновлення wasSelectedAnybody
		if (service.wasSelectedAnybody) {
			this.analyticData.orderService.by.wasSelectedAnybody[service.orderServiceId] = orderServiceData;
		}
	}

	/**
	 * NOTE: #3
	 * @private
	 */
	private calculateAverages(): void {
		// Обчислення середнього часу сервісу
		this.analyticData.summary.average.serviceTime = this.totalServiceCount > 0 ? this.totalServiceTime / this.totalServiceCount : 0;

		// Середній дохід за статусом
		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = this.analyticData.summary.revenue.total.by.status[status];
			const countByStatus = this.analyticData.counter.orderService.by.status[status];
			this.analyticData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;

			// Середній дохід за джерелом
			for (const source of getEnumKeys(ApplicationEnum)) {
				const totalBySource = this.analyticData.summary.revenue.total.by.source[source][status];
				const countBySource = this.analyticData.counter.orderService.by.source[source][status];
				this.analyticData.summary.revenue.average.by.source[source][status] = countBySource > 0 ? totalBySource / countBySource : 0;
			}

		}

		// Обчислення середніх значень для кожного спеціаліста
		for (const specialistId in this.analyticData.specialistRecord) {
			const specialistData = this.analyticData.specialistRecord[specialistId];
			this.calculateEntityAverages(specialistData);
		}

		// Обчислення середніх значень для кожного сервісу
		for (const serviceId in this.analyticData.serviceRecord) {
			const serviceData = this.analyticData.serviceRecord[serviceId];
			this.calculateEntityAverages(serviceData);
		}

		// Обчислення середніх значень для кожного клієнта
		for (const customerId in this.analyticData.customerRecord) {
			const customerData = this.analyticData.customerRecord[customerId];
			this.calculateEntityAverages(customerData);
		}
	}

	/**
	 * NOTE: #3.1
	 * Обчислення середніх значень для сутності (спеціаліст, сервіс, клієнт)
	 * @param entityData
	 * @private
	 */
	private calculateEntityAverages(entityData: Analytic.ICustomer | Analytic.IService | Analytic.ISpecialist): void {
		entityData.summary.average.serviceTime = entityData.counter.orderService.total > 0
			? entityData.summary.total.serviceTime / entityData.counter.orderService.total
			: 0;

		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = entityData.summary.revenue.total.by.status[status];
			const countByStatus = entityData.counter.orderService.by.status[status];
			entityData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;

			for (const source of getEnumKeys(ApplicationEnum)) {
				const totalBySource = entityData.summary.revenue.total.by.source[source][status];
				const countBySource = entityData.counter.orderService.by.source[source][status];
				entityData.summary.revenue.average.by.source[source][status] = countBySource > 0 ? totalBySource / countBySource : 0;
			}

		}
	}

	private calculateTotal(): void {
		// Обчислення загальної кількості спеціалістів
		this.analyticData.counter.specialists = this.uniqueSpecialists.size;

		// Обчислення загальної кількості сервісів
		this.analyticData.counter.services = this.uniqueServices.size;

		// Обчислення загальної кількості клієнтів
		this.analyticData.counter.customers = this.uniqueCustomers.size;

		// Обчислення загальної кількості замовлень
		this.analyticData.counter.orders.total = this.uniqueOrders.size;
	}

	private getOrderServiceRecord(service: DateRangeReportAnalyticApi.IService): Analytic.IOrderService {
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
			customers: service.attendants.map(attendant => {
				return {
					id: attendant.customerId,
					firstName: attendant.firstName,
					lastName: attendant.lastName,
					registeredDate: attendant.registeredDate
				};
			}),
			service: {
				id: service.serviceId,
				serviceName: service.serviceName
			}
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
