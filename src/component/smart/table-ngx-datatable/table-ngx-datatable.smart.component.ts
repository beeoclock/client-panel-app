import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	inject,
	input,
	output,
	resource,
	ResourceRef,
	signal
} from '@angular/core';
import {ColumnMode, DatatableComponent, SortEvent, SortPropDir} from "@swimlane/ngx-datatable";
import ECustomer from "@core/business-logic/customer/entity/e.customer";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ActivateEvent, DragEventData, PageEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {ReactiveFormsModule} from "@angular/forms";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	AutoRefreshButtonComponent
} from "@service/presentation/component/button/auto-refresh/auto-refresh.button.component";
import {
	NotFoundTableDataComponent
} from "@utility/presentation/component/not-found-table-data/not-found-table-data.component";
import {TranslatePipe} from "@ngx-translate/core";

export type FiltersType = {
	[key: string]: string | null | undefined | boolean | number;
};

export type AsyncLoadDataFunctionParams = {
	page: number;
	pageSize: number;
	orderBy: string;
	orderDir: string;
	filters: FiltersType
};

export type AsyncLoadDataFunction = (params: AsyncLoadDataFunctionParams) => Promise<{
	items: IBaseEntityRaw<string>[],
	totalSize: number
}>;

@Component({
	selector: 'app-table-ngx-datatable-smart-component',
	template: `
		@if (rows.length || resource.isLoading()) {

			<ngx-datatable
				class="h-full"
				[rows]="rows"
				[reorderable]="true"
				[rowDraggable]="rowDraggable()"
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
				(activate)="onActivate($event)"
				(sort)="setSort($event)"
				(rowDragEvents)="onRowDragEvents($event)"
				(page)="setPage($event)">
				<div loading-indicator class="flex h-full w-full items-center justify-center">
					<div>
						loading...
					</div>
				</div>
			</ngx-datatable>

		} @else {
<!--
				(clickListener)="openForm()"-->
			<not-found-table-data-component
				class="block h-full"
				[showLinkToForm]="true"
				[linkLabel]="'keyword.capitalize.add-service' | translate"
				[label]="'keyword.capitalize.dataNotFound' | translate">
				<service-auto-refresh-component [resetPage]="true" [resetParams]="true"/>
			</not-found-table-data-component>

		}

	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DatatableComponent,
		ReactiveFormsModule,
		AutoRefreshButtonComponent,
		NotFoundTableDataComponent,
		TranslatePipe,
	],
	standalone: true,
	host: {
		class: 'h-full',
	},
	styleUrl: './table-ngx-datatable.smart.component.scss',
})
export class TableNgxDatatableSmartComponent {

	public readonly defaultSort = input<{ orderBy: string; orderDir: OrderDirEnum; }>({
		orderBy: OrderByEnum.UPDATED_AT,
		orderDir: OrderDirEnum.ASC,
	});
	public readonly rowHeight = input<number | 'auto'>(50);
	public readonly filters = input<FiltersType>({});
	public readonly columnList = input.required<TableColumn[]>();
	public readonly rowDraggable = input<boolean>(false);
	public readonly loadData = input.required<AsyncLoadDataFunction>();

	public readonly actionColumn = input<TableColumn | null>(null);

	public readonly activate = output<ActivateEvent<any>>();
	public readonly rowDragEvents = output<DragEventData>();

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

	public readonly sharedUow = inject(SharedUow);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

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
			filters: this.filters(),
		}),

		defaultValue: {
			items: [],
			totalSize: 0,
		},

		// Define an async loader that retrieves data.
		// The resource calls this function every time the `request` value changes.
		loader: async ({request: {page, pageSize, sort: {orderBy, orderDir}, filters}}) => {

			this.cache.set(page, true);

			// Counter of pending API calls
			this.isLoading.set(this.isLoading() + 1);

			const {items, totalSize} = await this.loadData()({
				page,
				pageSize,
				orderBy,
				orderDir,
				filters,
			});

			// Create array to store data if missing
			// The array should have the correct number of with "holes" for missing data
			if (!this.rows?.length) {
				this.rows = new Array<ECustomer>(totalSize || 0);
				this.changeDetectorRef.detectChanges();
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

	public onRowDragEvents($event: DragEventData) {
		this.rowDragEvents.emit($event)
	}

	public onActivate($event: ActivateEvent<unknown>) {
		this.activate.emit($event);
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
