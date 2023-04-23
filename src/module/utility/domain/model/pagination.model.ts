import {TypeGuard} from '@p4ck493/ts-type-guard';
import {is} from 'thiis';
import {OrderByEnum} from '@utility/domain/enum';

export interface IPaginationModel_Configuration {
  checkPageSizeBeforeSet: boolean;
  checkPageMaxBeforeSet: boolean;
  checkPageMinBeforeSet: boolean;
}

export type OrderDirType = 'desc' | 'asc';

export interface IPaginationModel<ITEM> {
  page?: number;
  maxPage?: number;
  minPage?: number;
  pageSize?: number;
  orderDir?: OrderDirType;
  orderBy?: string;
  items?: ITEM[];
  totalSize?: number;
  configuration?: IPaginationModel_Configuration;
}

export type IPaginationModel_QueryParams = Pick<IPaginationModel<any>, 'orderDir' | 'orderBy' | 'pageSize' | 'page'>;

export type IPaginationModel_List_Response<ITEM> = Pick<IPaginationModel<ITEM>, 'items' | 'totalSize'>;

export class PaginationModel<ITEM> implements IPaginationModel<ITEM> {

  constructor(
    public page: number = PaginationModel.defaultPage,
    public maxPage: number = PaginationModel.defaultMaxPage,
    public minPage: number = PaginationModel.defaultMinPage,
    public pageSize: number = PaginationModel.defaultPageSize,
    public orderDir: OrderDirType = PaginationModel.defaultOrderDirection,
    public orderBy: string = PaginationModel.defaultOrderBy,
    public items: ITEM[] = [],
    public totalSize: number = 0,
    public configuration: IPaginationModel_Configuration = {
      checkPageSizeBeforeSet: true,
      checkPageMaxBeforeSet: true,
      checkPageMinBeforeSet: true,
    }
  ) {
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
    return this.availablePageSize[3];
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
  public static fromObject<ITEM>(data: IPaginationModel<ITEM>): PaginationModel<ITEM> {
    let model: PaginationModel<ITEM> = new PaginationModel<ITEM>();
    model = Object.assign(model, data);
    model.updateModel();
    return model;
  }

  @TypeGuard([is.object.not.empty])
  public updateFromObject(obj: IPaginationModel<ITEM>): PaginationModel<ITEM> {
    Object.assign(this, obj);
    this.updateModel();
    return this;
  }

  @TypeGuard([is.number])
  public setTotalSize(newTotalSize: number): void {
    if (newTotalSize < 0) {
      throw new Error('You try to set a new totalSize, which is less than 0.');
    }
    this.totalSize = newTotalSize;
    this.updateModel();
  }

  @TypeGuard([is.number])
  public setMaxPage(newMaxPage: number): void {
    if (newMaxPage < this.minPage) {
      throw new Error('You try to set a new maxPage, which is less than minPage.');
    }
    this.maxPage = newMaxPage;
  }

  @TypeGuard([is.number])
  public setPageSize(newPageSize: number): void {
    if (this.configuration.checkPageSizeBeforeSet) {
      if (is.false(PaginationModel.availablePageSize.includes(newPageSize))) {
        throw new Error('You try to set a new pageSize, which is not available.');
      }
    }
    this.pageSize = newPageSize;
  }

  @TypeGuard([is.number])
  public setPage(newPage: number): void {
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
  }

  public updateModel(): void {
    const newMaxPage: number = Math.ceil(this.totalSize / this.pageSize);
    this.setMaxPage(newMaxPage > this.minPage ? newMaxPage : 1);
  }

  public nextPage(): void {
    this.setPage(this.page + 1);
  }

  public prevPage(): void {
    this.setPage(this.page - 1);
  }

  public toObject(): IPaginationModel<ITEM> {
    return Object.assign({}, this);
  }

  public toQueryParams(): IPaginationModel_QueryParams {
    const {orderBy, orderDir, page, pageSize} = this;
    return {
      orderBy,
      orderDir,
      page,
      pageSize
    };
  }

}
