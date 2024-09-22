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

	constructor(iResponse: DateRangeReportAnalyticApi.IResponse) {
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
							source: {},
							status: {}
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: 0,
								[ApplicationEnum.client]: 0,
							},
							status: {
								[OrderServiceStatusEnum.requested]: 0,
								[OrderServiceStatusEnum.accepted]: 0,
								[OrderServiceStatusEnum.inProgress]: 0,
								[OrderServiceStatusEnum.done]: 0,
								[OrderServiceStatusEnum.rejected]: 0,
								[OrderServiceStatusEnum.cancelled]: 0,
								[OrderServiceStatusEnum.deleted]: 0,
							}
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
				orders: 0,
				orderService: {
					total: 0,
					by: {
						status: {
							[OrderServiceStatusEnum.requested]: 0,
							[OrderServiceStatusEnum.accepted]: 0,
							[OrderServiceStatusEnum.inProgress]: 0,
							[OrderServiceStatusEnum.done]: 0,
							[OrderServiceStatusEnum.rejected]: 0,
							[OrderServiceStatusEnum.cancelled]: 0,
							[OrderServiceStatusEnum.deleted]: 0,
						},
						source: {
							[ApplicationEnum.panel]: 0,
							[ApplicationEnum.client]: 0
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

	// Основний метод для обробки даних
	public process(): Analytic.I {
		// Обробка кожного звіту спеціаліста
		for (const specialistReport of this.iResponse.specialistReports) {
			this.processSpecialistReport(specialistReport);
		}

		// Обчислення середніх значень після збору всіх даних
		this.calculateAverages();

		this.initializeProcessingDate();

		return this.analyticData;
	}

	private initializeProcessingDate(): void {
		this.analyticData._meta.processedAt = new Date().toISOString();
	}

	// Обробка звіту спеціаліста
	private processSpecialistReport(specialistReport: DateRangeReportAnalyticApi.ISpecialistReport): void {
		const specialistId = specialistReport.specialist.memberId;

		// Додавання унікального спеціаліста
		if (!this.uniqueSpecialists.has(specialistId)) {
			this.uniqueSpecialists.add(specialistId);
			this.analyticData.counter.specialists++;
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

	// Ініціалізація запису спеціаліста
	private initializeSpecialistRecord(specialistId: string, specialistReport: DateRangeReportAnalyticApi.ISpecialistReport): void {
		this.analyticData.specialistRecord[specialistId] = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {},
							status: {}
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: 0,
								[ApplicationEnum.client]: 0
							},
							status: {
								[OrderServiceStatusEnum.requested]: 0,
								[OrderServiceStatusEnum.accepted]: 0,
								[OrderServiceStatusEnum.inProgress]: 0,
								[OrderServiceStatusEnum.done]: 0,
								[OrderServiceStatusEnum.rejected]: 0,
								[OrderServiceStatusEnum.cancelled]: 0,
								[OrderServiceStatusEnum.deleted]: 0,
							}
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
				orders: 0,
				orderService: {
					total: 0,
					by: {
						status: {
							[OrderServiceStatusEnum.requested]: 0,
							[OrderServiceStatusEnum.accepted]: 0,
							[OrderServiceStatusEnum.inProgress]: 0,
							[OrderServiceStatusEnum.done]: 0,
							[OrderServiceStatusEnum.rejected]: 0,
							[OrderServiceStatusEnum.cancelled]: 0,
							[OrderServiceStatusEnum.deleted]: 0,
						},
						source: {
							[ApplicationEnum.panel]: 0,
							[ApplicationEnum.client]: 0
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

	// Обробка звіту за датою
	private processDateReport(dateReport: DateRangeReportAnalyticApi.IDateReport, specialistData: Analytic.ISpecialist): void {
		// Обробка кожного сервісу в звіті за датою
		for (const service of dateReport.services) {
			this.processService(service, specialistData);
		}
	}

	// Обробка сервісу
	private processService(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist): void {
		// Оновлення лічильників загальної кількості сервісів
		this.analyticData.counter.orderService.total++;
		specialistData.counter.orderService.total++;

		// Оновлення лічильників за статусом
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		this.analyticData.counter.orderService.by.status[status]++;
		specialistData.counter.orderService.by.status[status]++;

		// Оновлення лічильників за джерелом
		const source = service.createdOn as keyof typeof ApplicationEnum;
		this.analyticData.counter.orderService.by.source[source]++;
		specialistData.counter.orderService.by.source[source]++;

		// Оновлення лічильника wasSelectedAnybody
		if (service.wasSelectedAnybody) {
			this.analyticData.counter.orderService.by.wasSelectedAnybody++;
			specialistData.counter.orderService.by.wasSelectedAnybody++;
		}

		// Оновлення загального доходу
		this.analyticData.summary.revenue.total.by.status[status] += service.price;
		this.analyticData.summary.revenue.total.by.source[source] += service.price;
		specialistData.summary.revenue.total.by.status[status] += service.price;
		specialistData.summary.revenue.total.by.source[source] += service.price;

		// Оновлення часу сервісу
		const duration = service.durationInSeconds;
		this.totalServiceTime += duration;
		this.totalServiceCount++;
		this.analyticData.summary.total.serviceTime += duration;
		specialistData.summary.total.serviceTime += duration;

		// Обробка запису orderService
		const orderServiceId = service.orderServiceId;
		if (!this.analyticData.orderService.record[orderServiceId]) {
			this.processOrderService(service, specialistData);
		}
	}

	// Обробка orderService
	private processOrderService(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist): void {
		// Обробка клієнтів, пов'язаних з сервісом
		const customersDetails = service.attendants.map(attendant => {
			return this.processCustomer(attendant, service, specialistData);
		});

		// Обробка сервісу в контексті загальної аналітики
		this.processServiceRecord(service, specialistData, customersDetails);

		// Обробка замовлення
		this.processOrder(service, specialistData, customersDetails);
	}

	// Обробка клієнта
	private processCustomer(attendant: DateRangeReportAnalyticApi.IAttendee, service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist): Analytic.ICustomer['details'] {
		const customerId = attendant.customerId;

		// Додавання унікального клієнта
		if (!this.uniqueCustomers.has(customerId)) {
			this.uniqueCustomers.add(customerId);
			this.analyticData.counter.customers++;
		}

		// Ініціалізація запису клієнта, якщо він ще не існує
		if (!this.analyticData.customerRecord[customerId]) {
			this.initializeCustomerRecord(customerId, attendant);
		}

		const customerData = this.analyticData.customerRecord[customerId];

		// Оновлення лічильників клієнта
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		const source = service.createdOn as keyof typeof ApplicationEnum;
		const duration = service.durationInSeconds;

		customerData.counter.orderService.total++;
		customerData.counter.orderService.by.status[status]++;
		customerData.counter.orderService.by.source[source]++;
		if (service.wasSelectedAnybody) {
			customerData.counter.orderService.by.wasSelectedAnybody++;
		}

		// Оновлення доходу та часу сервісу клієнта
		customerData.summary.revenue.total.by.status[status] += service.price;
		customerData.summary.revenue.total.by.source[source] += service.price;
		customerData.summary.total.serviceTime += duration;

		// Додавання записів спеціаліста до клієнта
		customerData.specialistRecord[specialistData.details.id] = specialistData;

		return customerData.details;
	}

	// Ініціалізація запису клієнта
	private initializeCustomerRecord(customerId: string, attendant: DateRangeReportAnalyticApi.IAttendee): void {
		this.analyticData.customerRecord[customerId] = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {},
							status: {}
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: 0,
								[ApplicationEnum.client]: 0
							},
							status: {
								[OrderServiceStatusEnum.requested]: 0,
								[OrderServiceStatusEnum.accepted]: 0,
								[OrderServiceStatusEnum.inProgress]: 0,
								[OrderServiceStatusEnum.done]: 0,
								[OrderServiceStatusEnum.rejected]: 0,
								[OrderServiceStatusEnum.cancelled]: 0,
								[OrderServiceStatusEnum.deleted]: 0,
							}
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
				orders: 0,
				orderService: {
					total: 0,
					by: {
						status: {
							[OrderServiceStatusEnum.requested]: 0,
							[OrderServiceStatusEnum.accepted]: 0,
							[OrderServiceStatusEnum.inProgress]: 0,
							[OrderServiceStatusEnum.done]: 0,
							[OrderServiceStatusEnum.rejected]: 0,
							[OrderServiceStatusEnum.cancelled]: 0,
							[OrderServiceStatusEnum.deleted]: 0,
						},
						source: {
							[ApplicationEnum.panel]: 0,
							[ApplicationEnum.client]: 0
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
	}

	// Обробка запису сервісу
	private processServiceRecord(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist, customersDetails: Analytic.ICustomer['details'][]): void {
		const serviceId = service.serviceId;

		// Додавання унікального сервісу
		if (!this.uniqueServices.has(serviceId)) {
			this.uniqueServices.add(serviceId);
			this.analyticData.counter.services++;
		}

		// Ініціалізація запису сервісу, якщо він ще не існує
		if (!this.analyticData.serviceRecord[serviceId]) {
			this.initializeServiceRecord(serviceId, service);
		}

		const serviceData = this.analyticData.serviceRecord[serviceId];

		// Оновлення лічильників сервісу
		const status = service.status as keyof typeof OrderServiceStatusEnum;
		const source = service.createdOn as keyof typeof ApplicationEnum;
		const duration = service.durationInSeconds;

		serviceData.counter.orderService.total++;
		serviceData.counter.orderService.by.status[status]++;
		serviceData.counter.orderService.by.source[source]++;
		if (service.wasSelectedAnybody) {
			serviceData.counter.orderService.by.wasSelectedAnybody++;
		}

		// Оновлення доходу та часу сервісу
		serviceData.summary.revenue.total.by.status[status] += service.price;
		serviceData.summary.revenue.total.by.source[source] += service.price;
		serviceData.summary.total.serviceTime += duration;

		// Додавання записів спеціаліста до сервісу
		serviceData.specialistRecord[specialistData.details.id] = specialistData;

		// Додавання записів клієнтів до сервісу
		for (const customerDetail of customersDetails) {
			serviceData.customerRecord[customerDetail.id] = this.analyticData.customerRecord[customerDetail.id];
			specialistData.customerRecord[customerDetail.id] = this.analyticData.customerRecord[customerDetail.id];
		}
	}

	// Ініціалізація запису сервісу
	private initializeServiceRecord(serviceId: string, service: DateRangeReportAnalyticApi.IService): void {
		this.analyticData.serviceRecord[serviceId] = {
			summary: {
				revenue: {
					average: {
						by: {
							source: {},
							status: {}
						}
					},
					total: {
						by: {
							source: {
								[ApplicationEnum.panel]: 0,
								[ApplicationEnum.client]: 0
							},
							status: {
								[OrderServiceStatusEnum.requested]: 0,
								[OrderServiceStatusEnum.accepted]: 0,
								[OrderServiceStatusEnum.inProgress]: 0,
								[OrderServiceStatusEnum.done]: 0,
								[OrderServiceStatusEnum.rejected]: 0,
								[OrderServiceStatusEnum.cancelled]: 0,
								[OrderServiceStatusEnum.deleted]: 0,
							}
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
				orders: 0,
				orderService: {
					total: 0,
					by: {
						status: {
							[OrderServiceStatusEnum.requested]: 0,
							[OrderServiceStatusEnum.accepted]: 0,
							[OrderServiceStatusEnum.inProgress]: 0,
							[OrderServiceStatusEnum.done]: 0,
							[OrderServiceStatusEnum.rejected]: 0,
							[OrderServiceStatusEnum.cancelled]: 0,
							[OrderServiceStatusEnum.deleted]: 0,
						},
						source: {
							[ApplicationEnum.panel]: 0,
							[ApplicationEnum.client]: 0
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

	// Обробка замовлення
	private processOrder(service: DateRangeReportAnalyticApi.IService, specialistData: Analytic.ISpecialist, customersDetails: Analytic.ICustomer['details'][]): void {
		const orderId = service.orderId;

		// Додавання унікального замовлення
		if (!this.uniqueOrders.has(orderId)) {
			this.uniqueOrders.add(orderId);
			this.analyticData.counter.orders++;
			specialistData.counter.orders++;

			// Ініціалізація запису замовлення
			this.analyticData.orderRecord[orderId] = {
				id: orderId,
				orderService: []
			};
		}

		// Додавання orderService до замовлення
		const orderServiceData = {
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
			customers: customersDetails,
			service: this.analyticData.serviceRecord[service.serviceId].details
		};

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
		for (const customerDetail of customersDetails) {
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

	// Обчислення середніх значень
	private calculateAverages(): void {
		// Обчислення середнього часу сервісу
		this.analyticData.summary.average.serviceTime = this.totalServiceCount > 0 ? this.totalServiceTime / this.totalServiceCount : 0;

		// Середній дохід за статусом
		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = this.analyticData.summary.revenue.total.by.status[status];
			const countByStatus = this.analyticData.counter.orderService.by.status[status];
			this.analyticData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;
		}

		// Середній дохід за джерелом
		for (const source of getEnumKeys(ApplicationEnum)) {
			const totalBySource = this.analyticData.summary.revenue.total.by.source[source];
			const countBySource = this.analyticData.counter.orderService.by.source[source];
			this.analyticData.summary.revenue.average.by.source[source] = countBySource > 0 ? totalBySource / countBySource : 0;
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

	// Обчислення середніх значень для сутності (спеціаліст, сервіс, клієнт)
	private calculateEntityAverages(entityData: Analytic.ICustomer | Analytic.IService | Analytic.ISpecialist): void {
		entityData.summary.average.serviceTime = entityData.counter.orderService.total > 0
			? entityData.summary.total.serviceTime / entityData.counter.orderService.total
			: 0;

		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = entityData.summary.revenue.total.by.status[status];
			const countByStatus = entityData.counter.orderService.by.status[status];
			entityData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;
		}

		for (const source of getEnumKeys(ApplicationEnum)) {
			const totalBySource = entityData.summary.revenue.total.by.source[source];
			const countBySource = entityData.counter.orderService.by.source[source];
			entityData.summary.revenue.average.by.source[source] = countBySource > 0 ? totalBySource / countBySource : 0;
		}
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
			return { oldValue: x, newValue: y };
		}

		if (typeof x !== 'object' || x === null || y === null) {
			// Якщо це примітивні типи або null, повертаємо обидва значення
			return { oldValue: x, newValue: y };
		}

		if (Array.isArray(x) && Array.isArray(y)) {
			if (x.length !== y.length) {
				return { oldValue: x, newValue: y };
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
