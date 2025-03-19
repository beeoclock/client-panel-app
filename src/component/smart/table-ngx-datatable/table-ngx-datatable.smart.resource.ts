import {computed, Injectable, resource, ResourceRef, signal} from "@angular/core";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {StateEnum} from "@core/shared/enum/state.enum";
import {is} from "@core/shared/checker";

export type FiltersType = {
	[key: string]: string | null | undefined | boolean | number;
};

export type AsyncLoadDataFunctionParams = {
	page: number;
	pageSize: number;
	orderBy: string;
	orderDir: string;
	filters: FiltersType
};

export type AsyncLoadDataFunction<ITEM extends IBaseEntityRaw<string>> = (params: AsyncLoadDataFunctionParams) => Promise<ResponseListType<ITEM>>;

@Injectable()
export class TableNgxDatatableSmartResource<ITEM extends IBaseEntityRaw<string>> {

	protected readonly loadData = async (parameters: AsyncLoadDataFunctionParams): Promise<ResponseListType<ITEM>> => {
		throw new Error('Not implemented');
	}

	public readonly parameters = signal<AsyncLoadDataFunctionParams>({
		page: 0,
		pageSize: 0,
		orderBy: OrderByEnum.UPDATED_AT,
		orderDir: OrderDirEnum.ASC,
		filters: {},
	});

	public readonly filters = signal<FiltersType>({
		state: StateEnum.active,
	});

	public filtersHistory: FiltersType = {
		state: StateEnum.active,
	};

	public readonly isLoading = signal(0);

	public readonly cache = new Map<number, boolean>();
	public readonly totalSize = signal<number>(0);

	public readonly mergedParameters = computed(() => {

		const parameters = this.parameters();
		const filters = this.filters();
		const filtersHistory = this.filtersHistory;
		let patch: Partial<AsyncLoadDataFunctionParams> = {};

		if (is.not_compare(filters, filtersHistory)) {
			this.reset();
			patch = {
				...patch,
				page: 1,
			};
			this.filtersHistory = filters;
		}

		return {
			...parameters,
			filters,
			...patch,
		};

	});

	public rows: ITEM[] = [];

	public reset() {
		this.cache.clear();
		// Set all rows to null
		this.rows = Array(this.totalSize());
	}

	public readonly resource: ResourceRef<{
		items: IBaseEntityRaw<string>[],
		totalSize: number
	}> = resource({

		// Define a reactive request computation.
		// The request value recomputes whenever any read signals change.
		request: () => ({
			parameters: this.mergedParameters(),
		}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request: {parameters: {page, pageSize, orderBy, orderDir, filters}}}) => {

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

			const {items, totalSize} = await this.loadData({
				page,
				pageSize,
				orderBy,
				orderDir,
				filters,
			});

			// Create array to store data if missing
			// The array should have the correct number of with "holes" for missing data
			if (!this.rows?.length || this.rows.length !== totalSize) {
				this.rows = new Array<ITEM>(totalSize || 0);
				// this.changeDetectorRef.detectChanges();
			}

			if (currentTotalSize !== totalSize) {
				this.totalSize.set(totalSize);
			}

			// Calc starting row offset
			// This is the position to insert the new data
			const start = (page - 1) * pageSize;

			// Set rows to our new rows for display
			this.rows.splice(start, pageSize, ...items);

			// Decrement the counter of pending API calls
			this.isLoading.set(this.isLoading() - 1);

			return {items, totalSize};

		},

	});

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

}
