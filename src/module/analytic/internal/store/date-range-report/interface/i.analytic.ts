import {Types} from "@utility/types";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {OrderServiceStatusEnum} from "@order/domain/enum/order-service.status.enum";
import {ApplicationEnum} from "@utility/domain/enum/application.enum";

export namespace Analytic {

	export interface ISummary {
		revenue: {
			average: {
				by: {
					source: {
						-readonly [orderServiceCreatedOn in keyof typeof ApplicationEnum]: {
							-readonly [orderServiceStatus in keyof typeof OrderServiceStatusEnum]: number;
						};
					};
					status: {
						-readonly [orderServiceStatus in keyof typeof OrderServiceStatusEnum]: number;
					};
				};
			};
			total: {
				by: {
					source: {
						-readonly [orderServiceCreatedOn in keyof typeof ApplicationEnum]: {
							-readonly [orderServiceStatus in keyof typeof OrderServiceStatusEnum]: number;
						};
					};
					status: {
						-readonly [orderServiceStatus in keyof typeof OrderServiceStatusEnum]: number;
					};
				};
			};
		};
		total: {
			serviceTime: number;
		};
		average: {
			serviceTime: number;
		};
	}

	export interface ICounter {

		/**
		 * In context Summary the property means the number of specialists, not orderService.
		 * Example: There are 3 unique specialists and 2 same specialist, so the property should be 4.
		 */
		specialists: number;
		/**
		 * In context Customer the property means the number of services that customer has ordered, not orderService.
		 * Example: Customer A has ordered 3 unique services and 2 same service, so the property should be 4.
		 */
		services: number;
		/**
		 * In context Specialist the property means the number of customers that specialist has served, not orderService.
		 * Example: Specialist A has served 3 unique customers and 2 same customer, so the property should be 4.
		 */
		customers: number;
		// TODO: Add information about returning customers by registeredDate property.

		orders: {
			total: number;
		};
		orderService: {
			total: number;
			by: {
				status: {
					-readonly [status in keyof typeof OrderServiceStatusEnum]: number;
				};
				source: {
					-readonly [createdOn in keyof typeof ApplicationEnum]: {
						-readonly [status in keyof typeof OrderServiceStatusEnum]: number;
					};
				};
				wasSelectedAnybody: number;
			};
		};

	}

	export interface ISpecialist {
		summary: ISummary;
		counter: Omit<ICounter, 'specialists'>;
		details: {
			/**
			 * memberId
			 */
			id: string & Types.ObjectId;
			firstName: string;
			lastName: string;
			email: string & Types.Email;
		};
		serviceRecord: {
			[serviceId: string]: Omit<IService, 'specialistRecord'>;
		};
		orderRecord: {
			[orderId: string]: IOrder;
		};
		orderServiceRecord: {
			[orderServiceId: string]: IOrderService;
		};
		customerRecord: {
			[customerId: string]: Omit<ICustomer, 'specialistRecord'>;
		};
	}

	export interface IService {
		summary: ISummary;
		counter: Omit<ICounter, 'services'>;
		details: {
			/**
			 * serviceId
			 */
			id: string & Types.ObjectId;
			serviceName: string;
		};
		specialistRecord: {
			[specialistId: string]: Omit<ISpecialist, 'serviceRecord'>;
		};
		orderRecord: {
			[orderId: string]: IOrder;
		};
		orderServiceRecord: {
			[orderServiceId: string]: IOrderService;
		};
		customerRecord: {
			[customerId: string]: Omit<ICustomer, 'serviceRecord'>;
		};
	}

	export interface ICustomer {
		summary: ISummary;
		counter: Omit<ICounter, 'customers'>;
		details: {
			/**
			 * customerId
			 */
			id: string & Types.ObjectId;
			firstName: string;
			lastName: string;
			registeredDate: string & Types.DateTime;
		};
		specialistRecord: {
			[specialistId: string]: Omit<ISpecialist, 'customerRecord'>;
		};
		serviceRecord: {
			[serviceId: string]: Omit<IService, 'customerRecord'>;
		};
		orderRecord: {
			[orderId: string]: IOrder;
		};
		orderServiceRecord: {
			[orderServiceId: string]: IOrderService;
		};
	}

	export interface IOrder {
		id: string & Types.ObjectId;
		orderService: IOrderService[];
	}

	export interface IOrderService {
		id: string & Types.ObjectId;
		orderId: string & Types.ObjectId;
		price: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		durationInSeconds: number & Types.Minimum<0>;
		startTime: string & Types.DateTime;
		endTime: string & Types.DateTime;
		createdOn: ("client" | "panel") & Types.Default<"client">;
		wasSelectedAnybody: boolean & Types.Default<false>;
		status: OrderServiceStatusEnum & Types.Default<OrderServiceStatusEnum.accepted>;
		customers: ICustomer['details'][];
		service: IService['details'];
	}

	export interface I {

		summary: ISummary;
		counter: ICounter;

		specialistRecord: {
			[specialistId: string]: ISpecialist;
		};
		serviceRecord: {
			[serviceId: string]: IService;
		};
		customerRecord: {
			[customerId: string]: ICustomer;
		};

		// TODO: Calendar: {by: {date:{}, month: {}, week: {}, year: {}, hours: {}}}

		orderRecord: {
			[orderId: string]: IOrder;
		};
		orderService: {
			record: {
				[orderServiceId: string]: IOrderService;
			}
			by: {
				status: {
					-readonly [orderServiceStatus in keyof typeof OrderServiceStatusEnum]: {
						[orderServiceId: string]: IOrderService;
					};
				};
				source: {
					-readonly [orderServiceCreatedOn in keyof typeof ApplicationEnum]: {
						[orderServiceId: string]: IOrderService;
					};
				};
				wasSelectedAnybody: {
					[orderServiceId: string]: IOrderService;
				};
			};
		};

		// TODO: Add _meta property to store information about the data source or createdAt, processingDate, hash for cache, etc.
		_meta: {
			createdAt: string & Types.DateTime;
			processedAt: string & Types.DateTime;
		};

	}

}
