export interface IList<ITEM> {
  currentPage: number;
  isEmpty: boolean;
  isNotEmpty: boolean;
  items: ITEM[];
  resultsPerPage: number;
  totalPages: number;
  totalResults: number;
}
