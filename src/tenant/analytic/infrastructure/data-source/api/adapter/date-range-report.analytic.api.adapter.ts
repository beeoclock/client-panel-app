import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {AnalyticEndpointEnum} from "@tenant/analytic/infrastructure/endpoint/analytic.endpoint";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {Types} from "@core/shared/types";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {ApplicationEnum} from "@core/shared/enum/application.enum";

export namespace DateRangeReportAnalyticApi {

	export interface IRequestQueryParams {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
		startDateTime: string & Types.Date;
		endDateTime: string & Types.Date;
		specialistIds: string[];
	}

	export interface ISpecialist {
		// Mongodb ObjectId
		memberId: string & Types.ObjectId;
		firstName: string;
		lastName: string;
		email: string & Types.Email;
	}

	export interface IAttendee {
		customerId: string & Types.ObjectId;
		firstName: string;
		lastName: string;
		registeredDate: string & Types.DateTime;
	}

	export interface IProduct {
		orderId: string & Types.ObjectId;
		orderProductId: string & Types.ObjectId;
		productSpecialCode: string;
		price: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		saleDate: string & Types.DateTime;
	}

	export interface IService {
		orderServiceId: string & Types.ObjectId;
		orderId: string & Types.ObjectId;
		serviceId: string & Types.ObjectId;
		serviceName: string;
		price: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		durationInSeconds: number & Types.Minimum<0>;
		startTime: string & Types.DateTime;
		endTime: string & Types.DateTime;
		createdOn: ApplicationEnum & Types.Default<ApplicationEnum.client>;
		wasSelectedAnybody: boolean & Types.Default<false>;
		status: OrderServiceStatusEnum & Types.Default<OrderServiceStatusEnum.accepted>;
		attendants: IAttendee[];
	}

	export interface IDateReport {
		services: IService[];
		products: IProduct[];
		dateRevenue: number & Types.Minimum<0>;
		date: string & Types.Date;
	}

	export interface ISpecialistReport {
		specialist: ISpecialist;
		startDate: string & Types.Date;
		endDate: string & Types.Date;
		totalRevenue: number & Types.Minimum<0>;
		dateReports: IDateReport[];
	}

	export interface IDateRangeReport {
		startDate: string & Types.Date;
		endDate: string & Types.Date;
		specialistReports: ISpecialistReport[];
		totalRevenue: number & Types.Minimum<0>;
		totalOrders: number & Types.Minimum<0>;
		totalOrderServices: number & Types.Minimum<0>;
	}

	export type IResponse = IDateRangeReport;

	@Injectable()
	export class Adapter extends BaseApiAdapter<IResponse, [IRequestQueryParams]> {

		/**
		 * ARCHIVE ITEM BY ID
		 * @param params
		 */
		@TypeGuard([is.object_not_empty])
		public override execute$(params: IRequestQueryParams) {
			return this.httpClient.get<IResponse>(AnalyticEndpointEnum.dateRangeReport, {
				params
			});
		}

	}

}


