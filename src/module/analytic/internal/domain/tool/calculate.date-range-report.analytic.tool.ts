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

// Основна функція перетворення
export function transformIResponseToAnalytic(iResponse: DateRangeReportAnalyticApi.IResponse): Analytic.I {
	const analyticData: Analytic.I = {
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
		}
	};

	// Множини для унікальних ідентифікаторів
	const uniqueSpecialists = new Set<string>();
	const uniqueServices = new Set<string>();
	const uniqueCustomers = new Set<string>();
	const uniqueOrders = new Set<string>();

	// Змінні для обчислення середніх значень
	let totalServiceTime = 0;
	let totalServiceCount = 0;

	// Обробка кожного specialistReport
	for (const specialistReport of iResponse.specialistReports) {
		const specialistId = specialistReport.specialist.memberId;

		// Додавання унікального спеціаліста
		if (!uniqueSpecialists.has(specialistId)) {
			uniqueSpecialists.add(specialistId);
			analyticData.counter.specialists++;
		}

		// Ініціалізація запису спеціаліста
		if (!analyticData.specialistRecord[specialistId]) {
			analyticData.specialistRecord[specialistId] = {
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

		const specialistData = analyticData.specialistRecord[specialistId];

		// Обробка dateReports
		for (const dateReport of specialistReport.dateReports) {
			// Обробка services
			for (const service of dateReport.services) {
				// Оновлення лічильників
				analyticData.counter.orderService.total++;
				specialistData.counter.orderService.total++;

				// Оновлення за статусом
				const status = service.status as keyof typeof OrderServiceStatusEnum;
				analyticData.counter.orderService.by.status[status]++;
				specialistData.counter.orderService.by.status[status]++;

				// Оновлення за джерелом
				const source = service.createdOn as keyof typeof ApplicationEnum;
				analyticData.counter.orderService.by.source[source]++;
				specialistData.counter.orderService.by.source[source]++;

				// wasSelectedAnybody
				if (service.wasSelectedAnybody) {
					analyticData.counter.orderService.by.wasSelectedAnybody++;
					specialistData.counter.orderService.by.wasSelectedAnybody++;
				}

				// Оновлення загального доходу
				analyticData.summary.revenue.total.by.status[status] += service.price;
				analyticData.summary.revenue.total.by.source[source] += service.price;
				specialistData.summary.revenue.total.by.status[status] += service.price;
				specialistData.summary.revenue.total.by.source[source] += service.price;

				// Оновлення часу сервісу
				const duration = service.durationInSeconds;
				totalServiceTime += duration;
				totalServiceCount++;
				analyticData.summary.total.serviceTime += duration;
				specialistData.summary.total.serviceTime += duration;

				// Обробка orderService.record
				const orderServiceId = service.orderServiceId;
				if (!analyticData.orderService.record[orderServiceId]) {
					// Обробка клієнтів
					const customersDetails = service.attendants.map(attendant => {
						const customerId = attendant.customerId;

						// Додавання унікального клієнта
						if (!uniqueCustomers.has(customerId)) {
							uniqueCustomers.add(customerId);
							analyticData.counter.customers++;
						}

						// Ініціалізація запису клієнта
						if (!analyticData.customerRecord[customerId]) {
							analyticData.customerRecord[customerId] = {
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

						// Оновлення лічильників клієнта
						const customerData = analyticData.customerRecord[customerId];
						customerData.counter.orderService.total++;
						customerData.counter.orderService.by.status[status]++;
						customerData.counter.orderService.by.source[source]++;
						if (service.wasSelectedAnybody) {
							customerData.counter.orderService.by.wasSelectedAnybody++;
						}

						// Оновлення доходу клієнта
						customerData.summary.revenue.total.by.status[status] += service.price;
						customerData.summary.revenue.total.by.source[source] += service.price;

						// Оновлення часу сервісу клієнта
						customerData.summary.total.serviceTime += duration;

						// Додавання записів до specialistRecord клієнта
						customerData.specialistRecord[specialistId] = {
							...specialistData,
							serviceRecord: {}
						};

						// Додавання запису orderServiceRecord
						customerData.orderServiceRecord[orderServiceId] = {
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
						}; // Заповнимо пізніше

						return customerData.details;
					});

					// Обробка сервісу
					const serviceId = service.serviceId;
					if (!uniqueServices.has(serviceId)) {
						uniqueServices.add(serviceId);
						analyticData.counter.services++;
					}

					// Ініціалізація serviceRecord
					if (!analyticData.serviceRecord[serviceId]) {
						analyticData.serviceRecord[serviceId] = {
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

					const serviceData = analyticData.serviceRecord[serviceId];

					// Оновлення лічильників сервісу
					serviceData.counter.orderService.total++;
					serviceData.counter.orderService.by.status[status]++;
					serviceData.counter.orderService.by.source[source]++;
					if (service.wasSelectedAnybody) {
						serviceData.counter.orderService.by.wasSelectedAnybody++;
					}

					// Оновлення доходу сервісу
					serviceData.summary.revenue.total.by.status[status] += service.price;
					serviceData.summary.revenue.total.by.source[source] += service.price;

					// Оновлення часу сервісу
					serviceData.summary.total.serviceTime += duration;

					// Додавання записів до specialistRecord сервісу
					serviceData.specialistRecord[specialistId] = specialistData;

					// Додавання записів до customerRecord сервісу
					for (const attendant of service.attendants) {
						const customerId = attendant.customerId;
						serviceData.customerRecord[customerId] = {
							...analyticData.customerRecord[customerId],
							specialistRecord: {}
						};
						specialistData.customerRecord[customerId] = analyticData.customerRecord[customerId];
					}

					// Обробка замовлення
					const orderId = service.orderId;
					if (!uniqueOrders.has(orderId)) {
						uniqueOrders.add(orderId);
						analyticData.counter.orders++;
						specialistData.counter.orders++;

						// Ініціалізація orderRecord
						analyticData.orderRecord[orderId] = {
							id: orderId,
							orderService: []
						};
					}

					// Додавання orderService до замовлення
					analyticData.orderRecord[orderId].orderService.push({
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
						service: serviceData.details
					});

					// Додавання orderService.record
					analyticData.orderService.record[orderServiceId] = {
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
						service: serviceData.details
					};

					// Додавання orderRecord до specialistData
					specialistData.orderRecord[orderId] = analyticData.orderRecord[orderId];
					specialistData.orderServiceRecord[orderServiceId] = analyticData.orderService.record[orderServiceId];
					specialistData.serviceRecord[serviceId] = serviceData;

					// Додавання orderRecord до serviceData
					serviceData.orderRecord[orderId] = analyticData.orderRecord[orderId];
					serviceData.orderServiceRecord[orderServiceId] = analyticData.orderService.record[orderServiceId];

					// Додавання orderRecord до customerData
					for (const attendant of service.attendants) {
						const customerId = attendant.customerId;
						const customerData = analyticData.customerRecord[customerId];
						customerData.orderRecord[orderId] = analyticData.orderRecord[orderId];
						customerData.orderServiceRecord[orderServiceId] = analyticData.orderService.record[orderServiceId];
						customerData.serviceRecord[serviceId] = serviceData;
						customerData.specialistRecord[specialistId] = specialistData;
					}

					// Оновлення orderService.by.status
					analyticData.orderService.by.status[status][orderServiceId] = analyticData.orderService.record[orderServiceId];
					// Оновлення orderService.by.source
					analyticData.orderService.by.source[source][orderServiceId] = analyticData.orderService.record[orderServiceId];
					// Оновлення wasSelectedAnybody
					if (service.wasSelectedAnybody) {
						analyticData.orderService.by.wasSelectedAnybody[orderServiceId] = analyticData.orderService.record[orderServiceId];
					}
				}
			}
		}
	}

	// Обчислення середніх значень
	analyticData.summary.average.serviceTime = totalServiceCount > 0 ? totalServiceTime / totalServiceCount : 0;

	// Середній дохід за статусом та джерелом
	for (const status of getEnumKeys(OrderServiceStatusEnum)) {
		const totalByStatus = analyticData.summary.revenue.total.by.status[status];
		const countByStatus = analyticData.counter.orderService.by.status[status];
		analyticData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;
	}

	for (const source of getEnumKeys(ApplicationEnum)) {
		const totalBySource = analyticData.summary.revenue.total.by.source[source];
		const countBySource = analyticData.counter.orderService.by.source[source];
		analyticData.summary.revenue.average.by.source[source] = countBySource > 0 ? totalBySource / countBySource : 0;
	}

	// Аналогічно обчисліть середні значення для specialistRecord, serviceRecord та customerRecord
	// Обчислення для кожного спеціаліста
	for (const specialistId in analyticData.specialistRecord) {
		const specialistData = analyticData.specialistRecord[specialistId];

		specialistData.summary.average.serviceTime = specialistData.counter.orderService.total > 0
			? specialistData.summary.total.serviceTime / specialistData.counter.orderService.total
			: 0;

		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = specialistData.summary.revenue.total.by.status[status];
			const countByStatus = specialistData.counter.orderService.by.status[status];
			specialistData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;
		}

		for (const source of getEnumKeys(ApplicationEnum)) {
			const totalBySource = specialistData.summary.revenue.total.by.source[source];
			const countBySource = specialistData.counter.orderService.by.source[source];
			specialistData.summary.revenue.average.by.source[source] = countBySource > 0 ? totalBySource / countBySource : 0;
		}
	}

	// Обчислення для кожного сервісу
	for (const serviceId in analyticData.serviceRecord) {
		const serviceData = analyticData.serviceRecord[serviceId];

		serviceData.summary.average.serviceTime = serviceData.counter.orderService.total > 0
			? serviceData.summary.total.serviceTime / serviceData.counter.orderService.total
			: 0;

		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = serviceData.summary.revenue.total.by.status[status];
			const countByStatus = serviceData.counter.orderService.by.status[status];
			serviceData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;
		}

		for (const source of getEnumKeys(ApplicationEnum)) {
			const totalBySource = serviceData.summary.revenue.total.by.source[source];
			const countBySource = serviceData.counter.orderService.by.source[source];
			serviceData.summary.revenue.average.by.source[source] = countBySource > 0 ? totalBySource / countBySource : 0;
		}
	}

	// Обчислення для кожного клієнта
	for (const customerId in analyticData.customerRecord) {
		const customerData = analyticData.customerRecord[customerId];

		customerData.summary.average.serviceTime = customerData.counter.orderService.total > 0
			? customerData.summary.total.serviceTime / customerData.counter.orderService.total
			: 0;

		for (const status of getEnumKeys(OrderServiceStatusEnum)) {
			const totalByStatus = customerData.summary.revenue.total.by.status[status];
			const countByStatus = customerData.counter.orderService.by.status[status];
			customerData.summary.revenue.average.by.status[status] = countByStatus > 0 ? totalByStatus / countByStatus : 0;
		}

		for (const source of getEnumKeys(ApplicationEnum)) {
			const totalBySource = customerData.summary.revenue.total.by.source[source];
			const countBySource = customerData.counter.orderService.by.source[source];
			customerData.summary.revenue.average.by.source[source] = countBySource > 0 ? totalBySource / countBySource : 0;
		}
	}

	return analyticData;
}
