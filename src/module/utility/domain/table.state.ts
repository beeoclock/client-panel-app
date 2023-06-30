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
  }

  public set filters(value: any) { // TODO interface
    this.#filters = value;
    this.initHashSum();
  }

  public get filters(): any { // TODO interface
    return this.#filters;
  }

  public set maxPage(value: number) {
    this.#maxPage = value;
    this.initHashSum();
  }

  public get maxPage(): number {
    return this.#maxPage;
  }

  public set orderBy(value: string) {
    this.#orderBy = value;
    this.initHashSum();
  }

  public get orderBy(): string {
    return this.#orderBy;
  }

  public set orderDir(value: string) {
    this.#orderDir = value;
    this.initHashSum();
  }

  public get orderDir(): string {
    return this.#orderDir;
  }

  public set page(value: number) {
    this.#page = value;
    this.initHashSum();
  }

  public get page(): number {
    return this.#page;
  }

  public set pageSize(value: number) {
    this.#pageSize = value;
    this.initHashSum();
  }

  public get pageSize(): number {
    return this.#pageSize;
  }

  public set items(value: ITEM[]) {
    this.#items = value;
    this.initHashSum();
  }

  public get items(): ITEM[] {
    return this.#items;
  }

  public set total(value: number) {
    this.#total = value;
    this.initHashSum();
  }

  public get total(): number {
    return this.#total;
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
    this.#lastUpdate = (new Date()).toISOString();
    this.#hashSum = hash_sum({
      filters: this.filters,
      maxPage: this.maxPage,
      orderBy: this.orderBy,
      orderDir: this.orderDir,
      page: this.page,
      pageSize: this.pageSize,
    });
    return this.hashSum;
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
    Object.keys(json).forEach((key: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tableState[key] = json[key];
    });
    return tableState;
  }

}
