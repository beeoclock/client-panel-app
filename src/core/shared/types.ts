import {tags} from 'typia';
import {Format} from "typia/src/tags/Format";
import {HttpParams} from "@angular/common/http";

export namespace Types {
	export type Format<Value extends Format.Value> = tags.Format<Value>;
	export type Default<Value extends boolean | bigint | number | string> = tags.Default<Value>;
	export type Minimum<Value extends number> = tags.Minimum<Value>;
	export type Maximum<Value extends number> = tags.Maximum<Value>;
	export type MaxLength<Value extends number> = tags.MaxLength<Value>;
	export type Pattern<Value extends string> = tags.Pattern<Value>;
	export type ObjectId = Pattern<"^[0-9a-fA-F]{24}$">;
	export type DateTime = Format<"date-time">;
	export type Date = Format<"date">;
	export type Time = Format<"time">;
	export type YearMonth = Pattern<"^[0-9]{4}-[0-9]{2}$">;
	export type SID = Pattern<"^SM[0-9a-fA-F]{32}$">;
	export type Email = Format<"email">;

	export type QueryParams = HttpParams | {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
	};

	export type StandardQueryParams = {
		page: number;
		pageSize: number;
		orderBy: string;
		orderDir: string;
		phrase?: string;
		state?: string;
		updatedSince?: string;
		members?: string[];
		statuses?: string[];
		services?: string[];
	};


	export type PartialQueryParams = {
		page?: number;
		pageSize?: number;
		orderBy?: string;
		orderDir?: string;
		phrase?: string;
		state?: string;
		updatedSince?: string;
		members?: string[];
		statuses?: string[];
		services?: string[];
	};

	export type FindQueryParams = Types.PartialQueryParams | Types.QueryParams;
}
