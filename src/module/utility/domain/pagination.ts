import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from 'thiis';
import {OrderByEnum} from '@utility/domain/enum';
import {getPaginationItems} from "@utility/domain/pagination.items";
import hash_sum from "hash-sum";

export interface IPagination_Configuration {
  checkPageSizeBeforeSet: boolean;
  checkPageMaxBeforeSet: boolean;
  checkPageMinBeforeSet: boolean;
}

export type OrderDirType = 'desc' | 'asc';

export interface IPagination<ITEM> {
  page?: number;
  maxPage?: number;
  minPage?: number;
  pageSize?: number;
  orderDir?: OrderDirType;
  orderBy?: string;
  // items?: ITEM[];
  totalSize?: number;
  configuration?: IPagination_Configuration;
}

export type IPagination_QueryParams = Pick<IPagination<any>, 'orderDir' | 'orderBy' | 'pageSize' | 'page'>;
export type RIPagination_QueryParams = Required<IPagination_QueryParams>;

// export type IPagination_List_Response<ITEM> = Pick<IPagination<ITEM>, 'items' | 'totalSize'>;

export class Pagination<ITEM> implements IPagination<ITEM> {

  #hashSum: undefined | string;
  #lastUpdate: Date = new Date();
  public pages: number[] = [];

  constructor(
    public page: number = Pagination.defaultPage,
    public maxPage: number = Pagination.defaultMaxPage,
    public minPage: number = Pagination.defaultMinPage,
    public pageSize: number = Pagination.defaultPageSize,
    public orderDir: OrderDirType = Pagination.defaultOrderDirection,
    public orderBy: string = Pagination.defaultOrderBy,
    // public items: ITEM[] = [],
    public totalSize: number = 0,
    public configuration: IPagination_Configuration = {
      checkPageSizeBeforeSet: true,
      checkPageMaxBeforeSet: true,
      checkPageMinBeforeSet: true,
    }
  ) {
  }

  public get hasSum(): undefined | string {
    return this.#hashSum;
  }

  public static get defaultMaxPage(): number {
    return 1;
  }

  public static get defaultMinPage(): number {
    return 1;
  }

  public static get defaultPage(): number {
    return 1;
  }

  public static get availablePageSize(): number[] {
    return [5, 10, 20, 40, 80];
  }

  public static get defaultPageSize(): number {
    return this.availablePageSize[1];
  }

  public static get availableOrderDirection(): OrderDirType[] {
    return ['desc', 'asc'];
  }

  public static get defaultOrderDirection(): OrderDirType {
    return this.availableOrderDirection[0];
  }

  public static get availableOrderBy(): string[] {
    return [OrderByEnum.CREATED_AT];
  }

  public static get defaultOrderBy(): string {
    return this.availableOrderBy[0];
  }

  @TypeGuard([is.object.not.empty])
  public static fromObject<ITEM>(data: IPagination<ITEM>): Pagination<ITEM> {
    let model: Pagination<ITEM> = new Pagination<ITEM>();
    model = Object.assign(model, data);
    model.updateModel();
    return model;
  }

  @TypeGuard([is.object.not.empty])
  public static merge<ITEM>(first: IPagination<ITEM>, second: IPagination<ITEM>): Pagination<ITEM> {
    let model: Pagination<ITEM> = new Pagination<ITEM>();
    model = Object.assign(model, first);
    model = Object.assign(model, second);
    model.updateModel();
    return model;
  }

  @TypeGuard([is.object.not.empty])
  public updateFromObject(obj: IPagination<ITEM>): this {
    Object.assign(this, obj);
    this.updateModel();
    return this;
  }

  // public setItems(items: ITEM[]): this {
  //   this.items = items;
  //   return this;
  // }

  @TypeGuard([is.number])
  public setTotalSize(newTotalSize: number): this {
    if (newTotalSize < 0) {
      throw new Error('You try to set a new totalSize, which is less than 0.');
    }
    this.totalSize = newTotalSize;
    this.updateModel();
    return this;
  }

  @TypeGuard([is.number])
  public setMaxPage(newMaxPage: number): this {
    if (newMaxPage < this.minPage) {
      throw new Error('You try to set a new maxPage, which is less than minPage.');
    }
    this.maxPage = newMaxPage;
    return this;
  }

  public setOrderBy(orderBy: string): this {
    if (this.orderBy === orderBy) {
      this.orderDir = this.orderDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = orderBy;
    }
    return this;
  }

  public toggleOrderDir(force?: OrderDirType): this {
    this.orderDir = force ?? this.orderDir === 'asc' ? 'desc' : 'asc';
    return this;
  }

  @TypeGuard([is.number])
  public setPageSize(newPageSize: number): this {
    if (this.configuration.checkPageSizeBeforeSet) {
      if (is.false(Pagination.availablePageSize.includes(newPageSize))) {
        throw new Error('You try to set a new pageSize, which is not available.');
      }
    }
    this.pageSize = newPageSize;
    return this;
  }

  @TypeGuard([is.number])
  public setPage(newPage: number): this {
    if (this.configuration.checkPageMaxBeforeSet) {
      if (newPage > this.maxPage) {
        throw new Error('You try to set a new page, which is more than maxPage.');
      }
    }
    if (this.configuration.checkPageMinBeforeSet) {
      if (newPage < this.minPage) {
        throw new Error('You try to set a new page, which is less than minPage.');
      }
    }
    this.page = newPage;
    return this;
  }

  public updateModel(): void {
    const newMaxPage: number = Math.ceil(this.totalSize / this.pageSize);
    this.setMaxPage(newMaxPage > this.minPage ? newMaxPage : 1);
    // TODO: Move the method into the class
    this.pages = getPaginationItems(this.page, this.maxPage, 5);
    this.#hashSum = hash_sum(this);
    this.#lastUpdate = new Date();
  }

  public nextPage(): this {
    return this.setPage(this.page + 1);
  }

  public prevPage(): this {
    return this.setPage(this.page - 1);
  }

  public toObject(): IPagination<ITEM> {
    return Object.assign({}, this);
  }

  public toQueryParams(): RIPagination_QueryParams {
    const {orderBy, orderDir, page, pageSize} = this;
    return {
      orderBy,
      orderDir,
      page,
      pageSize
    };
  }

  /**
   *
   * @param params
   */
  public fromQueryParams(params: IPagination_QueryParams): void {
    if (is.object.not.empty(params)) {
      const newObject: any = {};
      if (params?.page) {
        newObject.page = +params?.page;
      }
      if (params?.pageSize) {
        newObject.pageSize = +params?.pageSize;
      }
      if (params?.orderBy) {
        newObject.orderBy = params?.orderBy;
      }
      if (params?.orderDir) {
        newObject.orderDir = params?.orderDir;
      }
      this.updateFromObject(newObject);
    }
  }

}
