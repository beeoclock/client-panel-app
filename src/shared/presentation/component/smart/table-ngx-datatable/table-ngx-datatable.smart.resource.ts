import {inject, Injectable, resource, ResourceRef, Signal, signal} from "@angular/core";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {z} from "zod";
import {injectQueryParams} from "ngxtension/inject-query-params";
import {flatten, unflatten} from "flat";
import {Router} from "@angular/router";
import {AbstractControl} from "@angular/forms";
import {is} from "@core/shared/checker";
import {createNotifier} from "ngxtension/create-notifier";

export type AsyncLoadDataFunctionParams = {
	page: number;
	pageSize: number;
	orderBy: string;
	orderDir: string;
	[key: string]: string | null | undefined | boolean | number;
};

@Injectable()
export class TableNgxDatatableSmartResource<ITEM extends IBaseEntityRaw<string>> {

	private readonly router = inject(Router);

	protected loadData(parameters: AsyncLoadDataFunctionParams): Promise<ResponseListType<ITEM>> {
		throw new Error("Method not implemented.");
	}

	public getNewForm(): AbstractControl {
		throw new Error("Method not implemented.");
	}

	public formValue() {
		return z.object({

			page: z.coerce.number().default(0),
			pageSize: z.coerce.number().default(0),
			orderBy: z.coerce.string().default(OrderByEnum.CREATED_AT),
			orderDir: z.coerce.string().default(OrderDirEnum.DESC),

		});
	}

	public readonly queryParams = injectQueryParams() as Signal<AsyncLoadDataFunctionParams>;

	public readonly useQueryParams: boolean = false;

	public readonly defaultParameters = this.formValue().parse({});

	public readonly parameters = signal<AsyncLoadDataFunctionParams>(this.defaultParameters);

	public readonly isLoading = signal(0);

	public readonly cache = new Map<number, boolean>();
	public readonly totalSize = signal<number>(0);
	public readonly resetScrollPosition = createNotifier();

	public rows: ITEM[] = [];

	public reset() {
		this.cache.clear();
		// Set all rows to null
		this.rows = Array(this.totalSize());
	}

	public patchParameters(parameters: AsyncLoadDataFunctionParams) {
		this.parameters.update((currentParameters) => ({
			...currentParameters,
			...parameters,
		}));
		this.updateQueryParams();
	}

	public setFilters(filters: AsyncLoadDataFunctionParams) {

		this.reset();
		this.parameters.set({
			...filters,
			page: 1,
		});
		this.resetScrollPosition.notify();
		this.updateQueryParams();
	}

	public updateQueryParams() {
		if (this.useQueryParams) {

			const queryParams = flatten(this.parameters()) as object;
			this.router.navigate([], {
				queryParams,
				queryParamsHandling: 'merge',
			});

		}
	}

	public readonly resource: ResourceRef<{
		items: IBaseEntityRaw<string>[],
		totalSize: number
	}> = resource({

		// Define a reactive request computation.
		// The request value recomputes whenever any read signals change.
		request: () => ({
			parameters: this.parameters(),
		}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request: {parameters}}) => {

			const {page, pageSize} = parameters;

			if (!is.object_not_empty(parameters)) {
				return {
					items: [],
					totalSize: 0,
				};
			}

			const currentTotalSize = this.totalSize();

			if (this.cache.get(page)) {
				return {
					items: this.rows.slice((page - 1) * pageSize, page * pageSize),
					totalSize: currentTotalSize,
				};
			}

			this.cache.set(page, true);

			// Counter of pending API calls
			this.isLoading.set(this.isLoading() + 1);

			const {items, totalSize} = await this.loadData(parameters);

			// Create array to store data if missing
			// The array should have the correct number of with "holes" for missing data
			if (!this.rows?.length || this.rows.length !== totalSize) {
				this.rows = new Array(totalSize || 0);
			}

			if (currentTotalSize !== totalSize) {
				this.totalSize.set(totalSize);
			}

			// Calc starting row offset
			// This is the position to insert the new data
			const start = (page - 1) * pageSize;

			// Set rows to our new rows for display
			const copy = this.rows.slice();
			copy.splice(start, pageSize, ...items);
			this.rows = copy;

			console.log({totalSize, items, page, pageSize})
			console.log('rows', this.rows);

			// Decrement the counter of pending API calls
			this.isLoading.set(this.isLoading() - 1);

			return {items, totalSize};

		},

	});

	public reload() {
		this.reset();
		this.parameters.update((parameters) => ({
			...parameters,
			page: 1,
		}));

	}

	public refreshDiscoveredPages() {
		this.cache.clear();
		const currentPage = this.parameters().page;
		for (let page = 1; page <= currentPage; page++) {
			this.parameters.update((parameters) => ({
				...parameters,
				page
			}));
		}
	}

	public parseQueryParams(queryParams: AsyncLoadDataFunctionParams): AsyncLoadDataFunctionParams {
		const filterForm = this.getNewForm();
		const unflattenedQueryParams = unflatten(queryParams) as unknown as object;
		const {data, success, error} = this.formValue().safeParse(unflattenedQueryParams);
		if (success) {
			filterForm.patchValue(data as unknown as object);
		} else {
			console.error('Error parsing query params:', error);
		}
		const value = (filterForm).getRawValue() as unknown as AsyncLoadDataFunctionParams;
		return value;

	}

}
