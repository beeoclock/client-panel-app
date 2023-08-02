import hash_sum from "hash-sum";
import {ActiveEnum} from "@utility/domain/enum";

export interface ITableState<ITEM> {
  hashSum: string;

  orderBy: string;
  orderDir: string;
  filters: Partial<{
    search: undefined | string;
    active: ActiveEnum;
    [key: string]: unknown;
  }>;
  page: number;
  pageSize: number;

  maxPage: number;
  items: ITEM[];
  total: number;
  lastUpdate: string;
}

export type TableState_BackendFormat = Pick<ITableState<any>, 'orderDir' | 'orderBy' | 'pageSize' | 'page' | 'filters'>;

export class TableState<ITEM> implements ITableState<ITEM> {

  #filters = {search: undefined, active: ActiveEnum.YES};
  #maxPage = 1;
  #orderBy = 'createdAt';
  #orderDir = 'asc';
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

  public set filters(value: any) { // TODO interface
    this.#filters = value;
    this.initHashSum();
    this.updateLastUpdate();
  }

  public get filters(): any { // TODO interface
    return this.#filters;
  }

  public set orderBy(value: string) {
    this.#orderBy = value;
    this.initHashSum();
    this.updateLastUpdate();
  }

  public get orderBy(): string {
    return this.#orderBy;
  }

  public set orderDir(value: string) {
    this.#orderDir = value;
    this.initHashSum();
    this.updateLastUpdate();
  }

  public get orderDir(): string {
    return this.#orderDir;
  }

  public set page(value: number) {
    this.#page = value;
    this.updateLastUpdate();
  }

  public get page(): number {
    return this.#page;
  }

  public set pageSize(value: number) {
    this.#pageSize = value;
    this.updateLastUpdate();
  }

  public get pageSize(): number {
    return this.#pageSize;
  }

  public set items(value: ITEM[]) {
    this.#items = value;
    this.updateLastUpdate();
  }

  public get items(): ITEM[] {
    return this.#items;
  }

  public set total(value: number) {
    this.#total = value;
    this.updateLastUpdate();
  }

  public get total(): number {
    return this.#total;
  }

  public set maxPage(value: number) {
    this.#maxPage = value;
    this.updateLastUpdate();
  }

  public get maxPage(): number {
    return this.#maxPage;
  }

  //

  public set lastUpdate(value: string) {
    this.#lastUpdate = value;
  }

  public get lastUpdate(): string {
    return this.#lastUpdate;
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
    });
    return this.hashSum;
  }

  public updateLastUpdate(): void {
    this.#lastUpdate = (new Date()).toISOString();
  }

  public toBackendFormat(): TableState_BackendFormat {
    return {
      filters: this.filters,
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
