import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {tags} from "typia";
import {AnalyticEndpointEnum} from "@module/analytic/external/endpoint/analytic.endpoint";

export namespace SmsUsedAnalyticApi {

	export interface IRequestQueryParams {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;

		startDate: string & tags.Format<"date">;
		endDate: string & tags.Format<"date">;
	}

	export interface IMessage {
		sid: string & tags.Pattern<"^SM[0-9a-fA-F]{32}$">; // SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
		dateCreated: string & tags.Format<"date-time">;
		dateUpdated: string & tags.Format<"date-time">;
		dateSent: string & tags.Format<"date-time">;
		to: string;
		from: string;
		status: "delivered";
		body: string;
		price: string & tags.Pattern<"^\\$0\\.[0-9]{4}$">; // "$0.0075",
		errorCode: number & tags.Default<0>;
		errorMessage: string & tags.Default<"">;
	}

	export interface ISmsUsed {
		startDate: string & tags.Format<"date-time">;
		endDate: string & tags.Format<"date-time">;
		totalMessages: number & tags.Minimum<0>;
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


