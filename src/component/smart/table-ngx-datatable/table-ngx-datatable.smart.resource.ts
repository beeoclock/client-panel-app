import {Injectable, resource, ResourceRef, signal} from "@angular/core";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";

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

	public readonly parameters = signal<{
		page: number;
		pageSize: number;
		orderBy: string;
		orderDir: OrderDirEnum;
		[key: string]: string | null | undefined | boolean | number;
	}>({
		page: 0,
		pageSize: 0,
		orderBy: OrderByEnum.UPDATED_AT,
		orderDir: OrderDirEnum.ASC,
	});

	public readonly filters = signal<FiltersType>({});

	public readonly isLoading = signal(0);

	public readonly cache = new Map<number, boolean>();
	public readonly totalSize = signal<number>(0);

	public rows: IBaseEntityRaw<string>[] = [];

	public reset() {
		this.cache.clear();
		// Set all rows to null
		this.rows = Array(this.totalSize());
		return this;
	}

	public readonly resource: ResourceRef<{
		items: IBaseEntityRaw<string>[],
		totalSize: number
	}> = resource({

		// Define a reactive request computation.
		// The request value recomputes whenever any read signals change.
		request: () => ({
			parameters: this.parameters(),
			filters: this.filters(),
		}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request: {parameters: {page, pageSize, orderBy, orderDir}, filters}}) => {

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
				this.rows = new Array<ECustomer>(totalSize || 0);
				// this.changeDetectorRef.detectChanges();
			}

			if (this.totalSize() !== totalSize) {
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

}
