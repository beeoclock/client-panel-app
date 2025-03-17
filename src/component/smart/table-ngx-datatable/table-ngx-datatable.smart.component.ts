import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	resource,
	ResourceRef,
	signal
} from '@angular/core';
import {ColumnMode, DatatableComponent, SortEvent, SortPropDir} from "@swimlane/ngx-datatable";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {PageEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {ReactiveFormsModule} from "@angular/forms";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";

type AsyncLoadDataFunction = (page: number, pageSize: number, orderBy: string, orderDir: string) => Promise<{
	items: IBaseEntityRaw<string>[],
	totalSize: number
}>;

@Component({
	selector: 'app-table-ngx-datatable-smart-component',
	template: `
		<ngx-datatable
			class="h-full"
			[rows]="rows"
			[reorderable]="true"
			[rowDraggable]="true"
			[columns]="columns()"
			[columnMode]="ColumnMode.force"
			[headerHeight]="50"
			[loadingIndicator]="isLoading() > 0"
			[ghostLoadingIndicator]="isLoading() > 0"
			[scrollbarV]="true"
			[footerHeight]="50"
			[rowHeight]="rowHeight()"
			[externalPaging]="true"
			[externalSorting]="true"
			[limit]="pageSize()"
			[count]="totalSize()"
			[offset]="page()"
			[sorts]="sorts()"
			(sort)="setSort($event)"
			(rowDragEvents)="rowDragEvents($event)"
			(page)="setPage($event)">
			<div loading-indicator class="custom-loading-indicator">loading...</div>
		</ngx-datatable>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DatatableComponent,
		ReactiveFormsModule,
	],
	standalone: true,
	host: {
		class: 'h-full',
	},
	styles: [
		`
			:host {

				ngx-datatable::ng-deep {

					@apply bg-white;

					datatable-header {

						@apply border-b;

						.datatable-header-inner {

							@apply h-full;

							.datatable-row-center {

								@apply flex h-full items-center;

								datatable-header-cell {

									@apply px-2;

									.datatable-header-cell-template-wrap {

										.datatable-icon-sort-unset {

										}

										.sort-desc {

											&:before {
												content: "\\F573";
												display: inline-block;
												font-family: "bootstrap-icons" !important;
												font-style: normal;
												font-weight: normal !important;
												font-variant: normal;
												text-transform: none;
												line-height: 1;
												vertical-align: -0.125em;
												-webkit-font-smoothing: antialiased;
											}

										}

										.sort-asc {

											&:before {
												content: "\\F571";
												display: inline-block;
												font-family: "bootstrap-icons" !important;
												font-style: normal;
												font-weight: normal !important;
												font-variant: normal;
												text-transform: none;
												line-height: 1;
												vertical-align: -0.125em;
												-webkit-font-smoothing: antialiased;
											}

										}

										.sort-btn {

										}

										.datatable-icon-up {

										}

									}

								}

							}

							.datatable-row-right {

								//@apply flex h-full items-center bg-white border-l;
								@apply h-0;

								datatable-header-cell {

									@apply px-2;

									.datatable-header-cell-template-wrap {


									}

								}

							}

						}

					}

					datatable-body {

						overflow: auto;

						datatable-selection {

							datatable-row-wrapper {

								datatable-body-row {

									@apply border-b;

									datatable-body-cell {

										@apply flex items-center px-2;

									}

									.datatable-row-right {

										@apply bg-white border-l;

										datatable-body-cell {

											@apply flex h-full items-center px-2;

										}

									}

								}

							}

						}

					}

					datatable-footer {

						@apply border-t;

						.page-count {
							@apply px-2
						}

						datatable-pager {

							@apply pr-2;

							.pager {

								@apply border rounded-md divide-x;

								li {

									&:first-child {

										a {
											@apply rounded-l-md;
										}

									}

									&:last-child {

										a {
											@apply rounded-r-md;
										}

									}

									a {

										@apply
										cursor-pointer
										relative
										inline-flex
										items-center
										px-4
										py-2
										text-sm
										font-semibold
										text-beeColor-900
										dark:text-white
										dark:ring-beeDarkColor-600
										hover:bg-beeColor-100
										dark:hover:bg-beeDarkColor-600
										focus:z-20
										focus:outline-offset-0;


										.datatable-icon-right:before {
											content: "\\F285";
											display: inline-block;
											font-family: "bootstrap-icons" !important;
											font-style: normal;
											font-weight: normal !important;
											font-variant: normal;
											text-transform: none;
											line-height: 1;
											vertical-align: -0.125em;
											-webkit-font-smoothing: antialiased;
										}

										.datatable-icon-skip:before {
											content: "\\F277";
											display: inline-block;
											font-family: "bootstrap-icons" !important;
											font-style: normal;
											font-weight: normal !important;
											font-variant: normal;
											text-transform: none;
											line-height: 1;
											vertical-align: -0.125em;
											-webkit-font-smoothing: antialiased;
										}

										.datatable-icon-left:before {
											content: "\\F284";
											display: inline-block;
											font-family: "bootstrap-icons" !important;
											font-style: normal;
											font-weight: normal !important;
											font-variant: normal;
											text-transform: none;
											line-height: 1;
											vertical-align: -0.125em;
											-webkit-font-smoothing: antialiased;
										}

										.datatable-icon-down:before {
											content: "\\eb28";
										}

										.datatable-icon-prev:before {
											content: "\\F276";
											display: inline-block;
											font-family: "bootstrap-icons" !important;
											font-style: normal;
											font-weight: normal !important;
											font-variant: normal;
											text-transform: none;
											line-height: 1;
											vertical-align: -0.125em;
											-webkit-font-smoothing: antialiased;
										}

									}

									&.pages {


									}

									&.active {

										a {
											@apply bg-beeColor-100 dark:bg-beeDarkColor-700;
										}

									}

								}
							}
						}
					}
				}
			}
		`
	],
})
export class TableNgxDatatableSmartComponent {

	public readonly defaultSort = input<{ orderBy: string; orderDir: OrderDirEnum; }>({
		orderBy: OrderByEnum.UPDATED_AT,
		orderDir: OrderDirEnum.ASC,
	});
	public readonly rowHeight = input<number | 'auto'>(50);
	public readonly columnList = input.required<TableColumn[]>();
	public readonly loadData = input.required<AsyncLoadDataFunction>();

	public readonly actionColumn = input<TableColumn | null>(null);

	public readonly sorts = computed(() => {
		const defaultSort = this.defaultSort();
		const sort = {
			prop: defaultSort.orderBy,
			dir: defaultSort.orderDir,
		} as SortPropDir;
		return [sort];
	});

	public readonly columns = computed(() => {
		const columns: TableColumn[] = this.columnList();

		// Add action column
		const actionColumn = this.actionColumn();
		if (actionColumn) {
			columns.push(actionColumn);
		}

		return columns;
	});

	public readonly totalSize = signal<number>(0);
	public readonly page = signal<number>(0);
	public readonly pageSize = signal<number>(0);
	public readonly sort = signal<{ orderBy: string; orderDir: OrderDirEnum; }>({
		orderBy: OrderByEnum.UPDATED_AT,
		orderDir: OrderDirEnum.ASC,
	});
	public offset = 0;

	public rows: IBaseEntityRaw<string>[] = [];

	public readonly cache = new Map<number, boolean>();

	public readonly ColumnMode = ColumnMode;

	public readonly isLoading = signal(0);

	public readonly sharedUow = inject(SharedUow);

	public readonly resource: ResourceRef<{
		items: IBaseEntityRaw<string>[],
		totalSize: number
	}> = resource({

		// Define a reactive request computation.
		// The request value recomputes whenever any read signals change.
		request: () => ({
			page: this.page(),
			pageSize: this.pageSize(),
			sort: this.sort(),
		}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request: {page, pageSize, sort: {orderBy, orderDir}}}) => {

			this.cache.set(page, true);

			// Counter of pending API calls
			this.isLoading.set(this.isLoading() + 1);

			const {items, totalSize} = await this.loadData()(page, pageSize, orderBy, orderDir);

			// Create array to store data if missing
			// The array should have the correct number of with "holes" for missing data
			if (!this.rows?.length) {
				this.rows = new Array<ECustomer>(totalSize || 0);
			}

			if (this.totalSize() !== totalSize) {
				this.totalSize.set(totalSize);
			}

			// Calc starting row offset
			// This is the position to insert the new data
			const start = page * pageSize;

			// Set rows to our new rows for display
			this.rows.splice(start, pageSize, ...items);

			// Decrement the counter of pending API calls
			this.isLoading.set(this.isLoading() - 1);

			return {items, totalSize};

		},

	});

	public reset() {
		this.cache.clear();
		this.page.set(0);
	}

	public rowDragEvents($event: any) {
		console.log($event);
	}

	public setSort($event: SortEvent) {
		const {sorts: {0: {dir, prop}}} = $event;
		this.sort.set({
			orderBy: prop as string,
			orderDir: dir as OrderDirEnum,
		});
	}

	public setPage(pageInfo: PageEvent) {
		// Current page number is determined by last call to setPage
		// This is the page the UI is currently displaying
		// The current page is based on the UI pagesize and scroll position
		// Pagesize can change depending on browser size
		this.offset = pageInfo.offset;

		// Calculate row offset in the UI using pageInfo
		// This is the scroll position in rows
		const rowOffset = pageInfo.offset * pageInfo.pageSize;

		const page = Math.floor(rowOffset / pageInfo.pageSize);

		// We keep a index of server loaded pages so we don't load same data twice
		// This is based on the server page not the UI
		if (pageInfo.pageSize !== this.pageSize()) {
			this.pageSize.set(pageInfo.pageSize);
			this.cache.clear();
		}

		if (this.cache.get(page)) {
			return;
		}

		this.page.set(page);
	}
}
