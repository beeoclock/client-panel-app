import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	effect,
	inject,
	input,
	output,
	signal
} from '@angular/core';
import {
	ColumnMode,
	DatatableComponent,
	DatatableFooterDirective,
	DataTableFooterTemplateDirective,
	SortEvent,
	SortPropDir
} from "@swimlane/ngx-datatable";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {ActivateEvent, DragEventData, PageEvent} from "@swimlane/ngx-datatable/lib/types/public.types";
import {TableColumn} from "@swimlane/ngx-datatable/lib/types/table-column.type";
import {ReactiveFormsModule} from "@angular/forms";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@src/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {
	PagerTableNgxDataTableSmartComponent
} from "@src/component/smart/table-ngx-datatable/pager.table-ngx-data-table.smart.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";


@Component({
	selector: 'app-table-ngx-datatable-smart-component',
	template: `
		@if (rows.length || resource.value().totalSize) {

			<!--
							[ghostLoadingIndicator]="isLoading() > 0"
							[loadingIndicator]="isLoading() > 0"-->

			<ngx-datatable
				#table
				class="h-full"
				[messages]="messages()"
				[rows]="rows"
				[reorderable]="true"
				[trackByProp]="trackByProp()"
				[rowDraggable]="rowDraggable()"
				[columns]="columns()"
				[columnMode]="ColumnMode.force"
				[headerHeight]="50"
				[scrollbarV]="true"
				[footerHeight]="50"
				[rowHeight]="rowHeight()"
				[externalPaging]="true"
				[externalSorting]="true"
				[limit]="pageSize()"
				[count]="totalSize()"
				[offset]="offsetPage()"
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

				<ngx-datatable-footer>
					<ng-template
						let-rowCount="rowCount"
						let-pageSize="pageSize"
						let-selectedCount="selectedCount"
						let-curPage="curPage"
						let-offset="offset"
						ngx-datatable-footer-template
					>
						<div class="page-count">
							{{ 'keyword.capitalize.total' | translate }}: {{ rowCount }}
						</div>
						<app-pager-table-ngx-datatable-smart-component
							[page]="curPage"
							[goToFirstPageVisible]="goToFirstPageVisible()"
							[goToLastPageVisible]="goToLastPageVisible()"
							[visiblePagesCount]="currentVisible()"
							[size]="pageSize"
							[count]="rowCount"
							[hidden]="false"
							(change)="table.onFooterPage($event)"/>
					</ng-template>

				</ngx-datatable-footer>
			</ngx-datatable>

		} @else {

			<ng-content select="not-found-table-data-component"/>

		}

	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DatatableComponent,
		ReactiveFormsModule,
		DatatableFooterDirective,
		DataTableFooterTemplateDirective,
		PagerTableNgxDataTableSmartComponent,
		TranslatePipe,
	],
	standalone: true,
	host: {
		class: 'h-full',
	},
	styleUrl: './table-ngx-datatable.smart.component.scss',
})
export class TableNgxDatatableSmartComponent {

	public readonly goToFirstPageVisible = input<boolean>(false);

	public readonly goToLastPageVisible = input<boolean>(false);

	public readonly defaultSort = input<{ orderBy: string; orderDir: OrderDirEnum; }>({
		orderBy: OrderByEnum.CREATED_AT,
		orderDir: OrderDirEnum.DESC,
	});
	public readonly rowHeight = input<number | 'auto'>(50);
	public readonly columnList = input.required<TableColumn[]>();
	public readonly rowDraggable = input<boolean>(false);
	public readonly trackByProp = input<string>('_id');
	public readonly currentVisible = input<number>(5);

	public readonly actionColumn = input<TableColumn | null>(null);

	public readonly activate = output<ActivateEvent<any>>();
	public readonly rowDragEvents = output<DragEventData>();

	public readonly offsetPage = computed(() => {
		// Current page number is determined by last call to setPage
		// This is the page the UI is currently displaying
		// The current page is based on the UI pagesize and scroll position
		// Pagesize can change depending on browser size
		const {page} = this.parameters();
		return (page - 1);
	});

	public readonly page = computed(() => {
		const {page} = this.parameters();
		return page;
	});
	public readonly pageSize = signal<number>(0);
	public readonly sort = signal<{ orderBy: string; orderDir: OrderDirEnum; }>({
		orderBy: OrderByEnum.CREATED_AT,
		orderDir: OrderDirEnum.DESC,
	});

	public readonly ColumnMode = ColumnMode;

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

	public readonly translateService = inject(TranslateService);
	public readonly sharedUow = inject(SharedUow);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);

	public readonly messages = input({
		emptyMessage: `
			<div class="w-full h-full flex items-center justify-center px-2 py-4">
				<p>${this.translateService.instant('keyword.capitalize.noData')}</p>
			</div>
		`,
	});

	public constructor() {
		let previousLoadingValue = 0;
		effect(() => {
			const isLoading = this.isLoading();
			if (isLoading !== previousLoadingValue) {
				previousLoadingValue = isLoading;
				this.changeDetectorRef.detectChanges();
			}
		})
	}

	public get cache() {
		return this.tableNgxDatatableSmartResource.cache;
	}

	public get parameters() {
		return this.tableNgxDatatableSmartResource.parameters;
	}

	public get rows() {
		return this.tableNgxDatatableSmartResource.rows;
	}

	public get totalSize() {
		return this.tableNgxDatatableSmartResource.totalSize;
	}

	public get resource() {
		return this.tableNgxDatatableSmartResource.resource;
	}

	public get isLoading() {
		return this.tableNgxDatatableSmartResource.isLoading;
	}

	public reset() {
		this.tableNgxDatatableSmartResource.reset();
	}

	public onRowDragEvents($event: DragEventData) {
		this.rowDragEvents.emit($event)
	}

	public onActivate($event: ActivateEvent<unknown>) {
		this.activate.emit($event);
	}

	public setSort($event: SortEvent) {
		const {sorts: {0: {dir, prop}}} = $event;
		this.reset();
		this.sort.set({
			orderBy: prop as string,
			orderDir: dir as OrderDirEnum,
		});
		this.updateParameters({page: 1});
	}

	public setPage(pageInfo: PageEvent) {

		// Calculate row offset in the UI using pageInfo
		// This is the scroll position in rows
		const rowOffset = pageInfo.offset * pageInfo.pageSize;

		// We keep a index of server loaded pages so we don't load same data twice
		// This is based on the server page not the UI
		if (pageInfo.pageSize !== this.pageSize()) {
			this.pageSize.set(pageInfo.pageSize);
			this.cache.clear();
		}

		const page = Math.floor(rowOffset / pageInfo.pageSize) + 1;

		this.updateParameters({page});
	}

	public updateParameters(patch: Partial<AsyncLoadDataFunctionParams> = {}) {
		const {orderBy, orderDir} = this.sort();
		this.parameters.update((parameters) => ({
			...parameters,
			page: this.page(),
			pageSize: this.pageSize(),
			orderBy,
			orderDir,
			...patch,
		}));
	}
}
