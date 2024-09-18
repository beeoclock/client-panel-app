import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {tags} from "typia";
import {AnalyticEndpointEnum} from "@module/analytic/external/endpoint/analytic.endpoint";
import {CurrencyCodeEnum} from "@utility/domain/enum";

export namespace DateRangeReportAnalyticApi {

	export interface IRequestQueryParams {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
		startDate: string & tags.Format<"date">;
		endDate: string & tags.Format<"date">;
		specialistIds: string[];
	}

	export interface ISpecialist {
		// Mongodb ObjectId
		memberId: string & tags.Pattern<"/^[0-9a-fA-F]{24}$/">;
		firstName: string;
		lastName: string;
		email: string & tags.Format<"email">;
	}

	export interface IProduct {
		orderId: string & tags.Pattern<"/^[0-9a-fA-F]{24}$/">;
		orderProductId: string & tags.Pattern<"/^[0-9a-fA-F]{24}$/">;
		productSpecialCode: string;
		price: number & tags.Minimum<0>;
		currency: CurrencyCodeEnum & tags.Default<CurrencyCodeEnum.USD>;
		saleDate: string & tags.Format<"date-time">;
	}

	export interface IService {
		orderServiceId: string & tags.Pattern<"/^[0-9a-fA-F]{24}$/">;
		serviceId: string & tags.Pattern<"/^[0-9a-fA-F]{24}$/">;
		serviceName: string;
		price: number & tags.Minimum<0>;
		currency: CurrencyCodeEnum & tags.Default<CurrencyCodeEnum.USD>;
		durationInSeconds: number & tags.Minimum<0>;
		startTime: string & tags.Format<"date-time">;
		endTime: string & tags.Format<"date-time">;
		createdOn: "client" | "panel" & tags.Default<"client">;
		wasSelectedAnybody: boolean & tags.Default<false>;
		status: "inProgress";
	}

	export interface ISpecialistReport {
		specialist: ISpecialist;
		date: string & tags.Format<"date">;
		totalRevenue: number & tags.Minimum<0>;
		services: IService[],
		products: IProduct[],
		createdAt: "2024-08-27T12:00:00Z",
		updatedAt: "2024-08-27T12:00:00Z"
	}

	export interface IDateRangeReport {
		date: string & tags.Format<"date">;
		specialistReports: ISpecialistReport[],
		totalRevenue: number & tags.Minimum<0>;
		totalOrders: number & tags.Minimum<0>;
		createdAt: string & tags.Format<"date-time">;
		updatedAt: string & tags.Format<"date-time">;
	}

	export type IResponse = IDateRangeReport;

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
			return this.httpClient.get<IResponse>(AnalyticEndpointEnum.dateRangeReport, {
				params
			});
		}

	}

}


