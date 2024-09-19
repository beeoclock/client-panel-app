import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {AnalyticEndpointEnum} from "@module/analytic/external/endpoint/analytic.endpoint";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {Types} from "@utility/types";

export namespace DailyReportAnalyticApi {

	export interface IRequestQueryParams {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;

		date: string & Types.Format<"date">;
		specialistIds: string[];
	}

	export interface ISpecialist {
		// Mongodb ObjectId
		memberId: string & Types.ObjectId;
		firstName: string;
		lastName: string;
		email: string & Types.Format<"email">;
	}

	export interface IProduct {
		orderId: string & Types.ObjectId;
		orderProductId: string & Types.ObjectId;
		productSpecialCode: string;
		price: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		saleDate: string & Types.Format<"date-time">;
	}

	export interface IService {
		orderServiceId: string & Types.ObjectId;
		serviceId: string & Types.ObjectId;
		serviceName: string;
		price: number & Types.Minimum<0>;
		currency: CurrencyCodeEnum & Types.Default<CurrencyCodeEnum.USD>;
		durationInSeconds: number & Types.Minimum<0>;
		startTime: string & Types.Format<"date-time">;
		endTime: string & Types.Format<"date-time">;
		createdOn: "client" | "panel" & Types.Default<"client">;
		wasSelectedAnybody: boolean & Types.Default<false>;
		status: "inProgress";
	}

	export interface ISpecialistReport {
		specialist: ISpecialist;
		date: string & Types.Format<"date">;
		totalRevenue: number & Types.Minimum<0>;
		services: IService[],
		products: IProduct[],
		createdAt: "2024-08-27T12:00:00Z",
		updatedAt: "2024-08-27T12:00:00Z"
	}

	export interface IDailyReport {
		date: string & Types.Format<"date">;
		specialistReports: ISpecialistReport[],
		totalRevenue: number & Types.Minimum<0>;
		totalOrders: number & Types.Minimum<0>;
		createdAt: string & Types.Format<"date-time">;
		updatedAt: string & Types.Format<"date-time">;
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


