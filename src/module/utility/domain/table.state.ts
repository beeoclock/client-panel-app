import hash_sum from "hash-sum";
import {ActiveEnum, OrderByEnum, OrderDirEnum} from "./enum";
import {StateEnum} from "@utility/domain/enum/state.enum";

export interface ITableState<ITEM> {
	hashSum: string;

	orderBy: OrderByEnum;
	orderDir: OrderDirEnum;
	filters: {
		search?: string;
		active?: string | ActiveEnum;
		state?: StateEnum;
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

export type TableState_BackendFormat<ITEM = unknown> =
	Pick<ITableState<ITEM>, 'orderDir' | 'orderBy' | 'pageSize' | 'page'>
	& ITableState<ITEM>['filters'];

// FILTERS = { [key in keyof ITEM]?: ITEM[key] }
export class TableState<ITEM> implements ITableState<ITEM> {

	#filters = {};
	#maxPage = 1;
	#hashSum = '';
	#items: ITEM[] = [];
	#total = 0;
	#lastUpdate = (new Date()).toISOString();

	readonly #pagination = {
		orderBy: OrderByEnum.CREATED_AT,
		orderDir: OrderDirEnum.DESC,
		page: 1,
		pageSize: 20,
	};

	constructor() {
		this.initHashSum();
		this.updateLastUpdate();
	}

	public set filters(value: { [key: string]: unknown }) { // TODO interface
		this.#filters = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get filters(): { [key: string]: unknown } { // TODO interface
		return this.#filters;
	}

	public setFilters(value: { [key: string]: unknown }): this { // TODO interface
		this.filters = value;
		return this;
	}

	public patchFilters(value: { [key: string]: unknown }): this { // TODO interface
		this.filters = {
			...this.filters,
			...value,
		};
		return this;
	}

	public clearFilters(): this {
		this.#filters = {};
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public setOrderBy(value: OrderByEnum) {
		this.orderBy = value;
		return this;
	}

	public set orderBy(value: OrderByEnum) {
		this.#pagination.orderBy = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get orderBy(): OrderByEnum {
		return this.#pagination.orderBy;
	}

	public set orderDir(value: OrderDirEnum) {
		this.#pagination.orderDir = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public setOrderDir(value: OrderDirEnum) {
		this.orderDir = value;
		return this;
	}

	public get orderDir(): OrderDirEnum {
		return this.#pagination.orderDir;
	}

	public setPage(value: unknown) {
		if ('number' !== typeof value) {
			return this;
		}
		this.page = value;
		return this;
	}

	public set page(value: number) {
		this.#pagination.page = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get page(): number {
		return this.#pagination.page;
	}

	public nextPage() {
		this.#pagination.page += 1;
		this.initHashSum();
		this.updateLastUpdate();
		return this;
	}

	public setPageSize(value: unknown) {
		if ('number' !== typeof value) {
			return this;
		}
		this.pageSize = value;
		return this;
	}

	public set pageSize(value: number) {
		this.#pagination.pageSize = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get pageSize(): number {
		return this.#pagination.pageSize;
	}

	public set items(value: ITEM[]) {
		this.#items = value;
		this.updateLastUpdate();
	}

	public setItems(value: ITEM[]) {
		this.items = value;
		return this;
	}

	public get items(): ITEM[] {
		return this.#items;
	}

	public clearItems(): this {
		this.#items = [];
		this.updateLastUpdate();
		return this;
	}

	public addItems(value: ITEM[]): this {
		this.#items = this.#items.concat(value);
		this.updateLastUpdate();
		return this;
	}

	public set total(value: number) {
		this.#total = value;
		this.updateLastUpdate();
	}

	public setTotal(value: number) {
		this.total = value;
		return this;
	}

	public get total(): number {
		return this.#total;
	}

	public set maxPage(value: number) {
		this.#maxPage = value;
		this.updateLastUpdate();
	}

	public setMaxPage(value: number) {
		this.maxPage = value;
		return this;
	}

	public get maxPage(): number {
		return this.#maxPage;
	}

	//

	public setLastUpdate(value: string) {
		this.lastUpdate = value;
		return this;
	}

	public set lastUpdate(value: string) {
		this.#lastUpdate = value;
	}

	public get lastUpdate(): string {
		return this.#lastUpdate;
	}

	public setHashSum(value: string) {
		this.hashSum = value;
		return this;
	}

	public set hashSum(value: string) {
		this.#hashSum = value;
	}

	public get hashSum(): string {
		return this.#hashSum;
	}

	public initHashSum(): string {
		this.#hashSum = hash_sum({
			filters: this.#filters,
			orderBy: this.#pagination.orderBy,
			orderDir: this.#pagination.orderDir,
			page: this.#pagination.page,
			pageSize: this.#pagination.pageSize,
		});
		return this.hashSum;
	}

	public addNextPageWithItems(items: ITEM[]): this {
		return this.nextPage().addItems(items);
	}

	public updateLastUpdate(): void {
		this.#lastUpdate = (new Date()).toISOString();
	}

	public toBackendFormat<T>(): TableState_BackendFormat<T> {
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

	public static create<T>(initialValue: Partial<ITableState<T>> = {}) {

		const tableState = new TableState<T>();

		Object.assign(tableState, initialValue);

		tableState.initHashSum();
		tableState.updateLastUpdate();

		return tableState;

	}

}
