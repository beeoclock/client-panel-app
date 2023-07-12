export interface IQueryParams {
  results: string;
  page: string;
  orderBy: string;
  sortOrder: string;
  [param: string]: string | number | boolean | readonly (string | number | boolean)[];
}
