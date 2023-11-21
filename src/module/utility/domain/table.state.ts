import hash_sum from "hash-sum";

export interface ITableState<ITEM> {
	hashSum: string;

	orderBy: string;
	orderDir: string;
	filters: {
		search?: string;
		active?: string;
		[key: string]: undefined | unknown;
	};
	page: number;
	pageSize: number;

	maxPage: number;
	items: ITEM[];
	total: number;
	lastUpdate: string;
}

export type PITableState<ITEM> = Partial<ITableState<ITEM>>;

export type TableState_BackendFormat<ITEM = any> =
	Pick<ITableState<ITEM>, 'orderDir' | 'orderBy' | 'pageSize' | 'page'>
	& ITableState<ITEM>['filters'];

export class TableState<ITEM> implements ITableState<ITEM> {

	#filters = {};
	#maxPage = 1;
	#orderBy = 'createdAt';
	#orderDir = 'desc';
	#page = 1;
	#pageSize = 20;
	#hashSum = '';
	#items: ITEM[] = [];
	#total = 0;
	#lastUpdate = (new Date()).toISOString();

	constructor() {
		this.initHashSum();
		this.updateLastUpdate();
	}

	public set filters(value: {[key: string]: unknown}) { // TODO interface
		this.#filters = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get filters(): {[key: string]: unknown} { // TODO interface
		return this.#filters;
	}

	public setFilters(value: {[key: string]: unknown}): this { // TODO interface
		this.filters = value;
		return this;
	}

	public setOrderBy(value: string) {
		this.#orderBy = value;
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public get orderBy(): string {
		return this.#orderBy;
	}

	public setOrderDir(value: string) {
		this.#orderDir = value;
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public get orderDir(): string {
		return this.#orderDir;
	}

	public setPage(value: number) {
		this.#page = value;
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public get page(): number {
		return this.#page;
	}

	public nextPage() {
		this.#page += 1;
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public setPageSize(value: number) {
		this.#pageSize = value;
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public get pageSize(): number {
		return this.#pageSize;
	}

	public setItems(value: ITEM[]) {
		this.#items = value;
		this.updateLastUpdate();
		return this;
	}

	public get items(): ITEM[] {
		return this.#items;
	}

	public setTotal(value: number) {
		this.#total = value;
		this.updateLastUpdate();
		return this;
	}

	public get total(): number {
		return this.#total;
	}

	public setMaxPage(value: number) {
		this.#maxPage = value;
		this.updateLastUpdate();
	}

	public get maxPage(): number {
		return this.#maxPage;
	}

	//

	public setLastUpdate(value: string) {
		this.#lastUpdate = value;
		return this;
	}

	public get lastUpdate(): string {
		return this.#lastUpdate;
	}

	public setHashSum(value: string) {
		this.#hashSum = value;
		return this;
	}

	public get hashSum(): string {
		return this.#hashSum;
	}

	public initHashSum(): string {
		this.#hashSum = hash_sum({
			filters: this.#filters,
			orderBy: this.#orderBy,
			orderDir: this.#orderDir,
			page: this.#page,
			pageSize: this.#pageSize,
		});
		return this.hashSum;
	}

	public updateLastUpdate(): void {
		this.#lastUpdate = (new Date()).toISOString();
	}

	public toBackendFormat(): TableState_BackendFormat {
		return {
			...this.filters,
			orderBy: this.orderBy,
			orderDir: this.orderDir,
			page: this.page,
			pageSize: this.pageSize,
		}
	}

	public toCache(): ITableState<ITEM> {
		return {
			filters: this.filters,
			maxPage: this.maxPage,
			orderBy: this.orderBy,
			orderDir: this.orderDir,
			page: this.page,
			pageSize: this.pageSize,
			hashSum: this.hashSum,
			items: this.items,
			total: this.total,
			lastUpdate: this.lastUpdate,
		}
	}

	public static fromCache<ITEM>(json: ITableState<ITEM>): TableState<ITEM> {

		const tableState = new TableState<ITEM>();

		const newObject = Object.assign(tableState, json);

		newObject.initHashSum();
		newObject.updateLastUpdate();

		return newObject;

	}

}
