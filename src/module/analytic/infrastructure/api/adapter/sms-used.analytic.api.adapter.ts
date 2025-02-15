import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {AnalyticEndpointEnum} from "@module/analytic/infrastructure/endpoint/analytic.endpoint";
import {Types} from "@src/core/shared/types";

export namespace SmsUsedAnalyticApi {

	export interface IRequestQueryParams {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;

		startDate: string & Types.Date;
		endDate: string & Types.Date;
	}

	export interface IMessage {
		sid: string & Types.SID; // SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
		dateCreated: string & Types.DateTime;
		dateUpdated: string & Types.DateTime;
		dateSent: string & Types.DateTime;
		to: string;
		from: string;
		status: "delivered";
		body: string;
		price: string & Types.Pattern<"^\\$0\\.[0-9]{4}$">; // "$0.0075",
		errorCode: number & Types.Default<0>;
		errorMessage: string & Types.Default<"">;
	}

	export interface ISmsUsed {
		startDate: string & Types.DateTime;
		endDate: string & Types.DateTime;
		totalMessages: number & Types.Minimum<0>;
		messages: IMessage[];
	}

	export type IResponse = ISmsUsed;

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
			return this.httpClient.get<IResponse>(AnalyticEndpointEnum.smsUsed, {
				params
			});
		}

	}

}


