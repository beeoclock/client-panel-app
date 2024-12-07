import {ResponseListType} from "@utility/adapter/base.api.adapter";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IOrderServiceDto} from "@order/external/interface/i.order-service.dto";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {IServiceDto} from "@order/external/interface/i.service.dto";
import {OrderStatusEnum} from "@order/domain/enum/order.status.enum";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";

interface IStatisticCalculator {
	summary: {
		total: {
			revenue: {
				recordByOrderStatus: {
					[orderStatus in OrderStatusEnum]: number; // OrderDto.total from each OrderDto
				};
				recordByOrderServiceStatus: {
					[orderServiceStatus in OrderServiceStatusEnum]: number; // OrderServiceDto.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.price ?? 0
				};
			};
			orderRecordByStatus: {
				[orderStatus in OrderStatusEnum]: number; // Orders.length
			};
			orderServiceRecordByStatus: {
				[orderServiceStatus in OrderServiceStatusEnum]: number; // Orders.services.length
			};
			service: number;
		};
		average: {
			billRecordByOrderStatus: {
				[orderStatus in OrderStatusEnum]: number; // total revenue / Orders.length
			};
		};
		rating: {
			service: {
				[serviceId: string]: { // OrderServiceDto.serviceSnapshot._id
					recordByOrderServiceStatus: {
						[orderServiceStatus in OrderServiceStatusEnum]: {
							count: number;
							percentage: number;
						};
					};
					service: IServiceDto;
				};
			};
			sort: {
				service: {
					by: {
						status: {
							done: {
								service: IServiceDto;
								count: number;
								percentage: number;
							}[]; // Sort by count
						};
					};
				};
			};
		}
	};
	orderRecordById: {
		[orderId: string]: IOrderDto;
	};
	orderServiceRecordById: {
		[orderServiceId: string]: IOrderServiceDto;
	};
	specialistRecordById: {
		[memberId: string]: {
			count: {
				service: {
					total: number;
					recordById: {
						[serviceId: string]: { // OrderServiceDto.serviceSnapshot._id
							count: number;
							percentage: number;
						};
					};
				};
			};
			total: {
				revenue: {
					recordByOrderStatus: {
						[orderStatus in OrderStatusEnum]: number; // OrderDto.total from each OrderDto
					};
					recordByOrderServiceStatus: {
						[orderServiceStatus in OrderServiceStatusEnum]: number; // OrderServiceDto.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.price ?? 0
					};
				};
				orderRecordByStatus: {
					[orderStatus in OrderStatusEnum]: number; // Orders.length
				};
				orderServiceRecordByStatus: {
					[orderServiceStatus in OrderServiceStatusEnum]: number; // Orders.services.length
				};
			};
			average: {
				billRecordByOrderStatus: {
					[orderStatus in OrderStatusEnum]: number; // total revenue / Orders.length
				};
			};
			rating: {
				service: {
					[serviceId: string]: { // OrderServiceDto.serviceSnapshot._id
						recordByOrderServiceStatus: {
							[orderServiceStatus in OrderServiceStatusEnum]: {
								count: number;
								percentage: number;
							};
						};
						service: IServiceDto;
					};
				};
			};
			specialist: ISpecialist;
		};
	};
}

export function initStatisticCalculator(): IStatisticCalculator {
	return {
		summary: {
			total: {
				revenue: {
					recordByOrderStatus: {
						[OrderStatusEnum.requested]: 0,
						[OrderStatusEnum.draft]: 0,
						[OrderStatusEnum.inProgress]: 0,
						[OrderStatusEnum.done]: 0,
						[OrderStatusEnum.rejected]: 0,
						[OrderStatusEnum.confirmed]: 0,
						[OrderStatusEnum.cancelled]: 0
					},
					recordByOrderServiceStatus: {
						[OrderServiceStatusEnum.requested]: 0,
						[OrderServiceStatusEnum.accepted]: 0,
						[OrderServiceStatusEnum.inProgress]: 0,
						[OrderServiceStatusEnum.done]: 0,
						[OrderServiceStatusEnum.rejected]: 0,
						[OrderServiceStatusEnum.deleted]: 0,
						[OrderServiceStatusEnum.cancelled]: 0
					}
				},
				orderRecordByStatus: {
					[OrderStatusEnum.requested]: 0,
					[OrderStatusEnum.draft]: 0,
					[OrderStatusEnum.inProgress]: 0,
					[OrderStatusEnum.done]: 0,
					[OrderStatusEnum.rejected]: 0,
					[OrderStatusEnum.confirmed]: 0,
					[OrderStatusEnum.cancelled]: 0
				},
				orderServiceRecordByStatus: {
					[OrderServiceStatusEnum.requested]: 0,
					[OrderServiceStatusEnum.accepted]: 0,
					[OrderServiceStatusEnum.inProgress]: 0,
					[OrderServiceStatusEnum.done]: 0,
					[OrderServiceStatusEnum.rejected]: 0,
					[OrderServiceStatusEnum.deleted]: 0,
					[OrderServiceStatusEnum.cancelled]: 0
				},
				service: 0
			},
			average: {
				billRecordByOrderStatus: {
					[OrderStatusEnum.requested]: 0,
					[OrderStatusEnum.draft]: 0,
					[OrderStatusEnum.inProgress]: 0,
					[OrderStatusEnum.done]: 0,
					[OrderStatusEnum.rejected]: 0,
					[OrderStatusEnum.confirmed]: 0,
					[OrderStatusEnum.cancelled]: 0
				}
			},
			rating: {
				service: {},
				sort: {
					service: {
						by: {
							status: {
								done: []
							}
						}
					}
				}
			},
		},
		orderRecordById: {},
		orderServiceRecordById: {},
		specialistRecordById: {},
	};
}

export function statisticCalculator(orderPage: ResponseListType<IOrderDto>): IStatisticCalculator {

	const result: IStatisticCalculator = initStatisticCalculator();

	// NOTE: Calculate total revenue and total orders by status
	orderPage.items.forEach((order) => {

		result.summary.total.orderRecordByStatus[order.status]++;

		result.orderRecordById[order._id] = order;

		order.services.forEach((orderService) => {

			const price = orderService.serviceSnapshot.durationVersions?.[0]?.prices?.[0]?.price ?? 0;
			const serviceId = orderService.serviceSnapshot._id;

			result.summary.total.service++;
			result.summary.total.orderServiceRecordByStatus[orderService.status]++;
			result.summary.total.revenue.recordByOrderStatus[order.status] += price;
			result.summary.total.revenue.recordByOrderServiceStatus[orderService.status] += price;

			result.orderServiceRecordById[orderService._id] = orderService;

			// Note: Calculate rating by service
			calculateServiceRating(result, orderService, serviceId);

			// Note: Calculate rating by specialist
			orderService.orderAppointmentDetails.specialists.forEach((specialist) => {
				const memberId = specialist.member._id;

				const specialistFromRecord = result.specialistRecordById[memberId] = result.specialistRecordById[memberId] ?? {
					count: {
						service: {
							total: 0,
							recordById: {}
						}
					},
					total: {
						revenue: {
							recordByOrderStatus: {
								[OrderStatusEnum.requested]: 0,
								[OrderStatusEnum.draft]: 0,
								[OrderStatusEnum.inProgress]: 0,
								[OrderStatusEnum.done]: 0,
								[OrderStatusEnum.rejected]: 0,
								[OrderStatusEnum.confirmed]: 0,
								[OrderStatusEnum.cancelled]: 0
							},
							recordByOrderServiceStatus: {
								[OrderServiceStatusEnum.requested]: 0,
								[OrderServiceStatusEnum.accepted]: 0,
								[OrderServiceStatusEnum.inProgress]: 0,
								[OrderServiceStatusEnum.done]: 0,
								[OrderServiceStatusEnum.rejected]: 0,
								[OrderServiceStatusEnum.deleted]: 0,
								[OrderServiceStatusEnum.cancelled]: 0
							}
						},
						orderRecordByStatus: {
							[OrderStatusEnum.requested]: 0,
							[OrderStatusEnum.draft]: 0,
							[OrderStatusEnum.inProgress]: 0,
							[OrderStatusEnum.done]: 0,
							[OrderStatusEnum.rejected]: 0,
							[OrderStatusEnum.confirmed]: 0,
							[OrderStatusEnum.cancelled]: 0
						},
						orderServiceRecordByStatus: {
							[OrderServiceStatusEnum.requested]: 0,
							[OrderServiceStatusEnum.accepted]: 0,
							[OrderServiceStatusEnum.inProgress]: 0,
							[OrderServiceStatusEnum.done]: 0,
							[OrderServiceStatusEnum.rejected]: 0,
							[OrderServiceStatusEnum.deleted]: 0,
							[OrderServiceStatusEnum.cancelled]: 0
						}
					},
					specialist: specialist,
					rating: {
						service: {}
					},
					average: {
						billRecordByOrderStatus: {
							[OrderStatusEnum.requested]: 0,
							[OrderStatusEnum.draft]: 0,
							[OrderStatusEnum.inProgress]: 0,
							[OrderStatusEnum.done]: 0,
							[OrderStatusEnum.rejected]: 0,
							[OrderStatusEnum.confirmed]: 0,
							[OrderStatusEnum.cancelled]: 0
						}
					}
				};

				// Note: Calculate rating by specialist
				specialistFromRecord.count.service.total++;
				specialistFromRecord.count.service.recordById[serviceId] = specialistFromRecord.count.service.recordById[serviceId] ?? {
					count: 0
				};
				specialistFromRecord.count.service.recordById[serviceId].count++;

				specialistFromRecord.total.revenue.recordByOrderStatus[order.status] += price;
				specialistFromRecord.total.revenue.recordByOrderServiceStatus[orderService.status] += price;
				specialistFromRecord.total.orderRecordByStatus[order.status]++;
				specialistFromRecord.total.orderServiceRecordByStatus[orderService.status]++;

				// Note: Calculate average bill by order status
				specialistFromRecord.average.billRecordByOrderStatus[order.status] = specialistFromRecord.total.revenue.recordByOrderStatus[order.status] / specialistFromRecord.total.orderRecordByStatus[order.status];

				// Note: Calculate rating by service
				const ratingServiceSpecialist = specialistFromRecord.rating.service[serviceId] = specialistFromRecord.rating.service[serviceId] ?? {
					recordByOrderServiceStatus: {
						[OrderServiceStatusEnum.requested]: {
							count: 0,
							percentage: 0
						},
						[OrderServiceStatusEnum.accepted]: {
							count: 0,
							percentage: 0
						},
						[OrderServiceStatusEnum.inProgress]: {
							count: 0,
							percentage: 0
						},
						[OrderServiceStatusEnum.done]: {
							count: 0,
							percentage: 0
						},
						[OrderServiceStatusEnum.rejected]: {
							count: 0,
							percentage: 0
						},
						[OrderServiceStatusEnum.deleted]: {
							count: 0,
							percentage: 0
						},
						[OrderServiceStatusEnum.cancelled]: {
							count: 0,
							percentage: 0
						}
					},
					service: orderService.serviceSnapshot
				};

				ratingServiceSpecialist.recordByOrderServiceStatus[orderService.status].count++;
				ratingServiceSpecialist.recordByOrderServiceStatus[orderService.status].percentage = (ratingServiceSpecialist.recordByOrderServiceStatus[orderService.status].count * 100) / specialistFromRecord.count.service.total;

			});

		});

	});

	// NOTE: Calculate average bill by order status
	Object.keys(result.summary.total.revenue.recordByOrderStatus).forEach((key) => {
		const status = key as OrderStatusEnum;
		result.summary.average.billRecordByOrderStatus[status] = result.summary.total.revenue.recordByOrderStatus[status] / result.summary.total.orderRecordByStatus[status];
	});

	prepareSortServiceByDone(result);

	return result;

}


function calculateServiceRating(result: IStatisticCalculator, orderService: IOrderServiceDto, serviceId: string) {
	const ratingService = result.summary.rating.service[serviceId] = result.summary.rating.service[serviceId] ?? {
		recordByOrderServiceStatus: {
			[OrderServiceStatusEnum.requested]: {
				count: 0,
				percentage: 0
			},
			[OrderServiceStatusEnum.accepted]: {
				count: 0,
				percentage: 0
			},
			[OrderServiceStatusEnum.inProgress]: {
				count: 0,
				percentage: 0
			},
			[OrderServiceStatusEnum.done]: {
				count: 0,
				percentage: 0
			},
			[OrderServiceStatusEnum.rejected]: {
				count: 0,
				percentage: 0
			},
			[OrderServiceStatusEnum.deleted]: {
				count: 0,
				percentage: 0
			},
			[OrderServiceStatusEnum.cancelled]: {
				count: 0,
				percentage: 0
			}
		},
		service: orderService.serviceSnapshot
	};

	ratingService.recordByOrderServiceStatus[orderService.status].count++;

	// TODO: Calculate it once
	ratingService.recordByOrderServiceStatus[orderService.status].percentage = (ratingService.recordByOrderServiceStatus[orderService.status].count * 100) / result.summary.total.service;
}

function prepareSortServiceByDone(result: IStatisticCalculator) {
	const sortServiceByDone = result.summary.rating.sort.service.by.status.done;

	Object.keys(result.summary.rating.service).forEach((serviceId) => {
		const serviceRecord = result.summary.rating.service[serviceId];
		const done = serviceRecord.recordByOrderServiceStatus[OrderServiceStatusEnum.done].count;

		sortServiceByDone.push({
			service: serviceRecord.service,
			count: done,
			percentage: (done * 100) / result.summary.total.service,
		});
	});

	sortServiceByDone.sort((a, b) => b.count - a.count);
}
