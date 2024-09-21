// Here we will calculate the date range for the report for analytic propery in store
import {DateRangeReportAnalyticApi} from "@module/analytic/external/api/adapter/date-range-report.analytic.api.adapter";
import {
	IDateRangeAnalyticState
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.state";

export function calculateDateRangeReportAnalyticTool(response: DateRangeReportAnalyticApi.IResponse): IDateRangeAnalyticState['analytic'] {
	if (!response) {
		return null;
	}

	const analyticData: IDateRangeAnalyticState['analytic'] = {
		summary: {
			income: response.totalRevenue,
			averageBill: response.totalRevenue / response.totalOrders,
			totalOrders: response.totalOrders,
			averageServiceTime: 0,
			totalServiceTime: 0,
			uniqueClients: 0,
			appointments: {
				total: 0,
				by: {
					panel: {
						total: 0,
						percentages: 0
					},
					client: {
						total: 0,
						percentages: 0
					}
				}
			}
		},
		counter: {
			by: {
				specialist: {},
				customer: {},
				service: {},
				calendar: {},
				month: {},
				weekDay: {},
				hour: {}
			}
		},
		service: {},
		specialist: {},
		customer: {},
	};

	// NOTE: SPECIALIST
	response.specialistReports.forEach((specialistReport: DateRangeReportAnalyticApi.ISpecialistReport) => {

		const specialistExist = specialistReport.specialist.memberId in analyticData.specialist;
		if (!specialistExist) {

			analyticData.specialist[specialistReport.specialist.memberId] = specialistReport.specialist;
			analyticData.counter.by.specialist[specialistReport.specialist.memberId] = {
				income: specialistReport.totalRevenue,
				uniqueClients: 0,
				averageBill: 0,
				averageServiceTime: 0,
				totalServiceTime: 0,
				appointments: {
					total: 0,
					by: {
						panel: {
							total: 0,
							percentages: 0
						},
						client: {
							total: 0,
							percentages: 0
						}
					}
				},
				uniqueClient: {},
			};

		}

		// NOTE: DATE REPORTS
		specialistReport.dateReports.forEach((dateReport) => {

			// NOTE: SERVICE
			dateReport.services.forEach((service: DateRangeReportAnalyticApi.IService) => {

				const date = new Date(service.startTime);

				// NOTE: Calculate appointments in total
				analyticData.summary.appointments.total++;
				// Calculate appointments by panel and client
				const {createdOn} = service as {createdOn: 'client' | 'panel'};
				analyticData.summary.appointments.by[createdOn].total++;

				// Set service in analyticData.service
				const serviceExist = service.serviceId in analyticData.service;
				if (!serviceExist) {
					analyticData.service[service.serviceId] = service;
				}

				const serviceExistInCounter = service.serviceId in analyticData.counter.by.service;
				if (!serviceExistInCounter) {
					analyticData.counter.by.service[service.serviceId] = {
						income: 0,
						uniqueClients: 0,
						appointments: {
							total: 0,
							by: {
								panel: 0,
								client: 0
							}
						}
					};
				}

				// NOTE: Service counter
				const serviceCounter = analyticData.counter.by.service[service.serviceId];

				// Calculate income
				serviceCounter.income += service.price;
				// Calculate appointments by panel and client
				serviceCounter.appointments.total++;
				serviceCounter.appointments.by[createdOn]++;

				// NOTE: Calendar counter
				// TODO: Додати інформацію про різницю між часом, тобто є певний час між тим коли замовили і наколи замовили, ця інформація може допомогти визначити час який витрачається на обробку замовлення та теоретично за скільки клієнт повернеться
				const serviceExistInCalendar = service.startTime in analyticData.counter.by.calendar;
				// Format: YYYY-MM-DD
				const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
				if (!serviceExistInCalendar) {
					analyticData.counter.by.calendar[dateKey] = {
						uniqueClients: 0,
						appointments: {
							total: 0,
							by: {
								panel: 0,
								client: 0
							}
						},
						income: 0
					};
				}

				const calendarCounter = analyticData.counter.by.calendar[dateKey];
				// Calculate appointments by panel and client
				calendarCounter.appointments.total++;
				calendarCounter.appointments.by[createdOn]++;
				// Calculate income
				calendarCounter.income += service.price;

				// NOTE: Month counter
				const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
				const monthExistInCounter = monthKey in analyticData.counter.by.month;
				if (!monthExistInCounter) {
					analyticData.counter.by.month[monthKey] = {
						uniqueClients: 0,
						appointments: {
							total: 0,
							by: {
								panel: 0,
								client: 0
							}
						},
						income: 0
					};
				}

				const monthCounter = analyticData.counter.by.month[monthKey];
				// Calculate appointments by panel and client
				monthCounter.appointments.total++;
				monthCounter.appointments.by[createdOn]++;
				// Calculate income
				monthCounter.income += service.price;

				// NOTE: Day counter
				const weekDay = date.getDay();
				const weekDayExistInCounter = weekDay in analyticData.counter.by.weekDay;
				if (!weekDayExistInCounter) {
					analyticData.counter.by.weekDay[weekDay] = {
						uniqueClients: 0,
						appointments: {
							total: 0,
							percentages: 0,
							by: {
								panel: {
									percentages: 0,
									total: 0
								},
								client: {
									total: 0,
									percentages: 0
								}
							}
						},
						income: 0
					};
				}

				const weekDayCounter = analyticData.counter.by.weekDay[weekDay];
				// Calculate appointments by panel and client
				weekDayCounter.appointments.total++;
				weekDayCounter.appointments.by[createdOn].total++;
				// Calculate income
				weekDayCounter.income += service.price;

				// NOTE: Hour counter
				const hour = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
				const hourExistInCounter = hour in analyticData.counter.by.hour;
				if (!hourExistInCounter) {
					analyticData.counter.by.hour[hour] = {
						uniqueClients: 0,
						appointments: {
							total: 0,
							by: {
								panel: 0,
								client: 0
							}
						},
						income: 0
					};
				}

				const hourCounter = analyticData.counter.by.hour[hour];
				// Calculate appointments by panel and client
				hourCounter.appointments.total++;
				hourCounter.appointments.by[createdOn]++;
				// Calculate income
				hourCounter.income += service.price;

				// NOTE: Specialist counter
				const specialistCounter = analyticData.counter.by.specialist[specialistReport.specialist.memberId];

				// Calculate averageBill
				specialistCounter.appointments.total++;
				// Calculate appointments by panel and client
				specialistCounter.appointments.by[createdOn].total++;
				specialistCounter.averageBill += service.price;
				specialistCounter.totalServiceTime += getDifferenceInSecondsBetweenTwoIso(service.startTime, service.endTime);

				// Calculate averageServiceTime
				const durationInSeconds = getDifferenceInSecondsBetweenTwoIso(service.startTime, service.endTime);
				analyticData.summary.totalServiceTime += durationInSeconds;

				// NOTE: ATTENDEE
				service.attendants.forEach((attendee: DateRangeReportAnalyticApi.IAttendee) => {

					if (!attendee.customerId || !attendee.customerId.length) {
						return;
					}

					// Set client in analyticData.customer if not exist
					const clientExistInCounter = attendee.customerId in analyticData.counter.by.customer;
					if (!clientExistInCounter) {
						analyticData.counter.by.customer[attendee.customerId] = {
							appointments: {
								total: 0,
								by: {
									panel: 0,
									client: 0
								}
							},
							order: {
								service: {
									[service.serviceId]: {
										appointments: {
											total: 0,
											by: {
												panel: 0,
												client: 0
											}
										},
										expenses: 0
									},
								},
							},
							expenses: 0
						};
					}

					// Set client in analyticData.customer if not exist
					const clientExist = attendee.customerId in analyticData.customer;
					if (!clientExist) {
						analyticData.customer[attendee.customerId] = attendee;
					}

					// Set client in specialistCounter.uniqueClient if not exist
					const clientExistInSpecialistCounter = attendee.customerId in specialistCounter.uniqueClient;
					if (!clientExistInSpecialistCounter) {
						specialistCounter.uniqueClient[attendee.customerId] = {
							appointments: {
								total: 0,
								by: {
									panel: 0,
									client: 0
								}
							},
							order: {
								service: {
									[service.serviceId]: {
										appointments: {
											total: 0,
											by: {
												panel: 0,
												client: 0
											}
										},
										expenses: 0
									},
								},
							},
							expenses: 0
						};
					}

					const clientCounterInSpecialistCounter = specialistCounter.uniqueClient[attendee.customerId];

					// Calculate appointments by panel and client
					clientCounterInSpecialistCounter.appointments.total++;
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					clientCounterInSpecialistCounter.appointments.by[service.createdOn]++;

					// Calculate expenses
					clientCounterInSpecialistCounter.expenses += service.price;

					// Set service in clientCounterInSpecialistCounter.order.service if not exist
					const serviceExistInClientCounterInSpecialistCounter = service.serviceId in clientCounterInSpecialistCounter.order.service;
					if (!serviceExistInClientCounterInSpecialistCounter) {
						clientCounterInSpecialistCounter.order.service[service.serviceId] = {
							appointments: {
								total: 0,
								by: {
									panel: 0,
									client: 0
								}
							},
							expenses: 0
						};
					}

					const serviceCounterInClientCounterInSpecialistCounter = clientCounterInSpecialistCounter.order.service[service.serviceId];
					serviceCounterInClientCounterInSpecialistCounter.expenses = service.price;
					serviceCounterInClientCounterInSpecialistCounter.appointments.total++;
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					serviceCounterInClientCounterInSpecialistCounter.appointments.by[service.createdOn]++;

					const clientCounter = analyticData.counter.by.customer[attendee.customerId];

					// Calculate appointments by panel and client
					clientCounter.appointments.total++;
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					clientCounter.appointments.by[service.createdOn]++;

					// Calculate expenses
					clientCounter.expenses += service.price;

					// Set service in clientCounter.order.service if not exist
					const serviceExistInClientCounter = service.serviceId in clientCounter.order.service;
					if (!serviceExistInClientCounter) {
						clientCounter.order.service[service.serviceId] = {
							appointments: {
								total: 0,
								by: {
									panel: 0,
									client: 0
								}
							},
							expenses: 0
						};
					}

					const serviceCounterInClientCounter = clientCounter.order.service[service.serviceId];
					serviceCounterInClientCounter.expenses = service.price;
					serviceCounterInClientCounter.appointments.total++;
					serviceCounterInClientCounter.appointments.by[createdOn]++;

				});

			});

		});

		const specialistCounter = analyticData.counter.by.specialist[specialistReport.specialist.memberId];
		// NOTE: Calculate averageBill of specialist
		specialistCounter.averageBill = specialistCounter.income / specialistCounter.appointments.total;
		// NOTE: Calculate averageServiceTime of specialist
		specialistCounter.averageServiceTime = specialistCounter.totalServiceTime / specialistCounter.appointments.total;
		// NOTE: Calculate percentage of appointments by panel and client and round to 2 decimal places
		specialistCounter.appointments.by.panel.percentages = Math.round(specialistCounter.appointments.by.panel.total / specialistCounter.appointments.total * 100 * 100) / 100;
		specialistCounter.appointments.by.client.percentages = Math.round(specialistCounter.appointments.by.client.total / specialistCounter.appointments.total * 100 * 100) / 100;

		analyticData.summary.appointments.by.panel.percentages = Math.round(analyticData.summary.appointments.by.panel.total / analyticData.summary.appointments.total * 100 * 100) / 100;
		analyticData.summary.appointments.by.client.percentages = Math.round(analyticData.summary.appointments.by.client.total / analyticData.summary.appointments.total * 100 * 100) / 100;

		Object.keys(analyticData.counter.by.weekDay).forEach((weekDay: string) => {
			const weekDayCounter = analyticData.counter.by.weekDay[Number(weekDay)];
			weekDayCounter.appointments.by.panel.percentages = Math.round(weekDayCounter.appointments.by.panel.total / weekDayCounter.appointments.total * 100 * 100) / 100;
			weekDayCounter.appointments.by.client.percentages = Math.round(weekDayCounter.appointments.by.client.total / weekDayCounter.appointments.total * 100 * 100) / 100;
			weekDayCounter.appointments.percentages = Math.round(weekDayCounter.appointments.total / analyticData.summary.appointments.total * 100 * 100) / 100;
		});

		// NOTE: Calculate uniqueClients
		analyticData.summary.uniqueClients = Object.keys(analyticData.customer).length;
		specialistCounter.uniqueClients = Object.keys(specialistCounter.uniqueClient).length;

		// NOTE: Calculate uniqueClients
		// Object.keys(analyticData.counter.by.service).forEach((serviceId) => {
		// 	const serviceCounter = analyticData.counter.by.service[serviceId];
		// 	serviceCounter.uniqueClients = Object.keys(serviceCounter.uniqueClient).length;
		// });

	});

	analyticData.summary.averageServiceTime += analyticData.summary.totalServiceTime / analyticData.summary.appointments.total;

	return analyticData;

}

/**
 *
 * @param firstIso
 * @param secondIso
 */
function getDifferenceInSecondsBetweenTwoIso(firstIso: string, secondIso: string): number {
	const firstDate = new Date(firstIso);
	const secondDate = new Date(secondIso);

	return Math.abs(firstDate.getTime() - secondDate.getTime()) / 1000;
}
