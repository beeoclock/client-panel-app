import {TypeGuard} from '@p4ck493/ts-type-guard';
import {OrderByEnum} from '@core/shared/enum';
import {getPaginationItems} from "@utility/domain/pagination.items";
import hash_sum from "hash-sum";
import {getMaxPage} from "@utility/domain/max-page";
import {is} from "@core/shared/checker";

export interface IPagination_Configuration {
  checkPageSizeBeforeSet: boolean;
  checkPageMaxBeforeSet: boolean;
  checkPageMinBeforeSet: boolean;
}

export type OrderDirType = 'desc' | 'asc';

export interface IPagination {
  page?: number;
  maxPage?: number;
  minPage?: number;
  pageSize?: number;
  orderDir?: OrderDirType;
  orderBy?: string;
  totalSize?: number;
  configuration?: IPagination_Configuration;
}

export type IPagination_QueryParams = Pick<IPagination, 'orderDir' | 'orderBy' | 'pageSize' | 'page'>;
export type RIPagination_QueryParams = Required<IPagination_QueryParams>;

/**
 *
 */
export class Pagination implements IPagination {

  #hashSum: undefined | string;
  public pages: number[] = [];

  constructor(
    public page: number = Pagination.defaultPage,
    public maxPage: number = Pagination.defaultMaxPage,
    public minPage: number = Pagination.defaultMinPage,
    public pageSize: number = Pagination.defaultPageSize,
    public orderDir: OrderDirType = Pagination.defaultOrderDirection,
    public orderBy: string = Pagination.defaultOrderBy,
    public lastUpdate: Date = new Date(),
    public totalSize: number = 0,
    public configuration: IPagination_Configuration = {
      checkPageSizeBeforeSet: true,
      checkPageMaxBeforeSet: true,
      checkPageMinBeforeSet: true,
    }
  ) {
  }

  public get hashSum(): undefined | string {
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

  /**
   *
   * @param data
   */
  @TypeGuard([is.object_not_empty])
  public static fromObject(data: IPagination): Pagination {
    let model: Pagination = new Pagination();
    model = Object.assign(model, data);
    model.updateModel(false);
    return model;
  }

  /**
   *
   * @param first
   * @param second
   */
  @TypeGuard([is.object_not_empty])
  public static merge(first: IPagination, second: IPagination): Pagination {
    let model: Pagination = new Pagination();
    model = Object.assign(model, first);
    model = Object.assign(model, second);
    model.updateModel();
    return model;
  }

  /**
   *
   * @param obj
   */
  @TypeGuard([is.object_not_empty])
  public updateFromObject(obj: IPagination): this {
    Object.assign(this, obj);
    this.updateModel(false);
    return this;
  }

  /**
   *
   * @param newTotalSize
   */
  @TypeGuard([is.number])
  public setTotalSize(newTotalSize: number): this {
    if (newTotalSize < 0) {
      throw new Error('You try to set a new totalSize, which is less than 0.');
    }
    this.totalSize = newTotalSize;
    this.updateModel();
    return this;
  }

  /**
   *
   * @param newMaxPage
   */
  @TypeGuard([is.number])
  public setMaxPage(newMaxPage: number): this {
    if (newMaxPage < this.minPage) {
      throw new Error('You try to set a new maxPage, which is less than minPage.');
    }
    this.maxPage = newMaxPage;
    return this;
  }

  /**
   *
   * @param orderBy
   */
  @TypeGuard([is.string])
  public getNextOrderDir(orderBy: string): string {
    return this.orderBy === orderBy ? (this.orderDir === 'asc' ? 'desc' : 'asc') : this.orderDir;
  }

  /**
   *
   * @param orderBy
   */
  public setOrderBy(orderBy: string): this {
    if (this.orderBy === orderBy) {
      this.orderDir = this.orderDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = orderBy;
    }
    return this;
  }

  /**
   *
   * @param force
   */
  public toggleOrderDir(force?: OrderDirType): this {
    this.orderDir = force ?? this.orderDir === 'asc' ? 'desc' : 'asc';
    return this;
  }

  /**
   *
   * @param newPageSize
   */
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

  /**
   *
   * @param newPage
   */
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

  /**
   *
   * @param updateLastUpdate
   */
  public updateModel(updateLastUpdate = true): void {

    this.setMaxPage(getMaxPage(this.totalSize, this.pageSize));
    this.pages = getPaginationItems(this.page, this.maxPage, 5);

    // Generate new hash_sum
    const {orderBy, orderDir, page, pageSize} = this;
    this.#hashSum = hash_sum({
      orderBy,
      orderDir,
      page,
      pageSize
    });

    if (updateLastUpdate) {

      // Update last update data
      this.lastUpdate = new Date();

    } else {

      if (is.string(this.lastUpdate)) {

        this.lastUpdate = new Date(this.lastUpdate);

      }

    }


  }

  public nextPage(): this {
    return this.setPage(this.page + 1);
  }

  public prevPage(): this {
    return this.setPage(this.page - 1);
  }

  public toObject(): IPagination {
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
    if (is.object_not_empty(params)) {
      const newObject: IPagination_QueryParams = {};
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

  /**
   *
   * @param orderBy
   */
  public getNewQueryParamsOfOrderBy(orderBy: string): { orderBy: string; orderDir: string; } {
    return {orderBy, orderDir: this.getNextOrderDir(orderBy)};
  }
}
