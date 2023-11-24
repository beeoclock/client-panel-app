import hash_sum from "hash-sum";
import {OrderByEnum, OrderDirEnum} from "./enum";

export interface ITableState<ITEM> {
	hashSum: string;

	orderBy: OrderByEnum;
	orderDir: OrderDirEnum;
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

export type TableState_BackendFormat<ITEM = unknown> =
	Pick<ITableState<ITEM>, 'orderDir' | 'orderBy' | 'pageSize' | 'page'>
	& ITableState<ITEM>['filters'];

export class TableState<ITEM> implements ITableState<ITEM> {

	#filters = {};
	#maxPage = 1;
	#orderBy = OrderByEnum.CREATED_AT;
	#orderDir = OrderDirEnum.DESC;
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

	public setOrderBy(value: OrderByEnum) {
		this.orderBy = value;
		return this;
	}

	public set orderBy(value: OrderByEnum) {
		this.#orderBy = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get orderBy(): OrderByEnum {
		return this.#orderBy;
	}

	public set orderDir(value: OrderDirEnum) {
		this.#orderDir = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public setOrderDir(value: OrderDirEnum) {
		this.orderDir = value;
		return this;
	}

	public get orderDir(): OrderDirEnum {
		return this.#orderDir;
	}

	public setPage(value: number) {
		this.page = value;
		return this;
	}

	public set page(value: number) {
		this.#page = value;
		this.initHashSum();
		this.updateLastUpdate();
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
		this.pageSize = value;
		return this;
	}

	public set pageSize(value: number) {
		this.#pageSize = value;
		this.initHashSum();
		this.updateLastUpdate();
	}

	public get pageSize(): number {
		return this.#pageSize;
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
