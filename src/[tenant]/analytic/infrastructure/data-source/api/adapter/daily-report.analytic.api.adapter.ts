import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {AnalyticEndpointEnum} from "@[tenant]/analytic/infrastructure/endpoint/analytic.endpoint";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {Types} from "@core/shared/types";

export namespace DailyReportAnalyticApi {

	export interface IRequestQueryParams {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;

		date: string & Types.Date;
		specialistIds: string[];
	}

	export interface ISpecialist {
		// Mongodb ObjectId
		memberId: string & Types.ObjectId;
		firstName: string;
		lastName: string;
		email: string & Types.Email;
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
		serviceId: string & Types.ObjectId;
		serviceName: string;
		price: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		durationInSeconds: number & Types.Minimum<0>;
		startTime: string & Types.DateTime;
		endTime: string & Types.DateTime;
		createdOn: "client" | "panel" & Types.Default<"client">;
		wasSelectedAnybody: boolean & Types.Default<false>;
		status: "inProgress";
	}

	export interface ISpecialistReport {
		specialist: ISpecialist;
		date: string & Types.Date;
		totalRevenue: number & Types.Minimum<0>;
		services: IService[],
		products: IProduct[],
		createdAt: "2024-08-27T12:00:00Z",
		updatedAt: "2024-08-27T12:00:00Z"
	}

	export interface IDailyReport {
		date: string & Types.Date;
		specialistReports: ISpecialistReport[],
		totalRevenue: number & Types.Minimum<0>;
		totalOrders: number & Types.Minimum<0>;
		createdAt: string & Types.DateTime;
		updatedAt: string & Types.DateTime;
	}

	export type IResponse = IDailyReport;

	@Injectable({
		providedIn: 'root'
	})
	export class Adapter extends BaseApiAdapter<IResponse, [IRequestQueryParams]> {

		/**
		 * ARCHIVE ITEM BY ID
		 * @param params
		 */
		@TypeGuard([is.object_not_empty])
		public override execute$(params: IRequestQueryParams) {
			return this.httpClient.get<IResponse>(AnalyticEndpointEnum.dailyReport, {
				params
			});
		}

	}

}


