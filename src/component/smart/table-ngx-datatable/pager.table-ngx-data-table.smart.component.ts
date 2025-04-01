import {ChangeDetectionStrategy, Component, EventEmitter, input, Input, Output, ViewEncapsulation} from '@angular/core';
import {DataTablePagerComponent as SuperDataTablePagerComponent} from '@swimlane/ngx-datatable';

@Component({
	selector: 'app-pager-table-ngx-datatable-smart-component',
	template: `
		<ul class="pager">
			@if (goToFirstPageVisible()) {
			<li [class.disabled]="!canPrevious()">
				<a
					href="javascript:void(0)"
					(click)="selectPage(1)">
					<i class="{{pagerPreviousIcon}}"></i>
				</a>
			</li>
			}
			<li [class.disabled]="!canPrevious()">
				<a
					href="javascript:void(0)"
					(click)="prevPage()">
					<i class="{{pagerLeftArrowIcon}}"></i>
				</a>
			</li>
			@for (pg of pages; track pg.number) {
				<li
					class="pages"
					[class.active]="pg.number === page">
					<a
						href="javascript:void(0)"
						(click)="selectPage(pg.number)">
						{{ pg.text }}
					</a>
				</li>
			}
			<li [class.disabled]="!canNext()">
				<a
					href="javascript:void(0)"
					(click)="nextPage()">
					<i class="{{pagerRightArrowIcon}}"></i>
				</a>
			</li>
			@if (goToLastPageVisible()) {
				<li [class.disabled]="!canNext()">
					<a
						href="javascript:void(0)"
						(click)="selectPage(totalPages)">
						<i class="{{pagerNextIcon}}"></i>
					</a>
				</li>
			}
		</ul>
	`,
	host: {
		class: 'datatable-pager'
	},
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PagerTableNgxDataTableSmartComponent extends SuperDataTablePagerComponent {

	public readonly goToFirstPageVisible = input<boolean>(true);

	public readonly goToLastPageVisible = input<boolean>(true);

	@Input()
	public override pagerLeftArrowIcon: string = 'bi bi-chevron-left';

	@Input()
	public override pagerRightArrowIcon: string = 'bi bi-chevron-right';

	@Input()
	public override pagerPreviousIcon: string = 'bi bi-chevron-bar-left';

	@Input()
	public override pagerNextIcon: string = 'bi bi-chevron-bar-right';


	@Input()
	public override set size(val: number) {
		this._size = val;
		this.pages = this.calcPages();
	}

	public override get size(): number {
		return this._size;
	}

	@Input()
	public override set count(val: number) {
		this._count = val;
		this.pages = this.calcPages();
	}

	public override get count(): number {
		return this._count;
	}

	@Input()
	public override set page(val: number) {
		this._page = val;
		this.pages = this.calcPages();
	}

	public override get page(): number {
		return this._page;
	}

	public override get totalPages(): number {
		const count = this.size < 1 ? 1 : Math.ceil(this.count / this.size);
		return Math.max(count || 0, 1);
	}

	@Output()
	public override change: EventEmitter<any> = new EventEmitter();

	public _visiblePagesCount: number = 3;

	@Input()
	public set visiblePagesCount(val: number) {
		this._visiblePagesCount = val;
		this.pages = this.calcPages();
	}

	public get visiblePagesCount(): number {
		return this._visiblePagesCount;
	}

	public override _count: number = 0;
	public override _page: number = 1;
	public override _size: number = 0;
	public override pages: any;

	public override canPrevious(): boolean {
		return this.page > 1;
	}

	public override canNext(): boolean {
		return this.page < this.totalPages;
	}

	public override prevPage(): void {
		this.selectPage(this.page - 1);
	}

	public override nextPage(): void {
		this.selectPage(this.page + 1);
	}

	public override selectPage(page: number): void {
		if (page > 0 && page <= this.totalPages && page !== this.page) {
			this.page = page;

			this.change.emit({
				page
			});
		}
	}

	public override calcPages(page?: number): any[] {
		const pages = [];
		let startPage = 1;
		let endPage = this.totalPages;
		const maxSize = this.visiblePagesCount;
		const isMaxSized = maxSize < this.totalPages;

		page = page || this.page;

		if (isMaxSized) {
			startPage = page - Math.floor(maxSize / 2);
			endPage = page + Math.floor(maxSize / 2);

			if (startPage < 1) {
				startPage = 1;
				endPage = Math.min(startPage + maxSize - 1, this.totalPages);
			} else if (endPage > this.totalPages) {
				startPage = Math.max(this.totalPages - maxSize + 1, 1);
				endPage = this.totalPages;
			}
		}

		for (let num = startPage; num <= endPage; num++) {
			pages.push({
				number: num,
				text: <string><any>num
			});
		}

		return pages;
	}
}
