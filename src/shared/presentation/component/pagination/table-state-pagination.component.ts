import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnChanges,
	output,
	SimpleChange
} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from "@angular/forms";
import {ITableState} from "@shared/domain/table.state";
import humanizeDuration from "humanize-duration";
import {DateTime} from "luxon";
import {getPaginationItems} from "@shared/domain/pagination.items";
import {environment} from "@environment/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MS_ONE_MINUTE} from "@shared/domain/const/c.time";
import {BooleanState} from "@shared/domain";

@Component({
	selector: 'utility-table-state-pagination-component',
	standalone: true,
	templateUrl: './table-state-pagination.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
	],
	styles: [
		`
			:host {
				.pagination-page-item {
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
					ring-1
					ring-inset
					ring-beeColor-300
					dark:ring-beeDarkColor-600
					hover:bg-beeColor-100
					dark:hover:bg-beeDarkColor-600
					focus:z-20
					focus:outline-offset-0
					first:rounded-l-md
					last:rounded-r-md;
				}
			}
        `
	]
})
export class TableStatePaginationComponent implements OnChanges {

	public readonly tableState = input<ITableState<unknown>>();

	public readonly mobileMode = input(false);

	public readonly pageSize = output<number>();
	public readonly page = output<number>();

	public lastUpdate: undefined | string;
	public pages: number[] = [];

	public readonly translateService = inject(TranslateService);

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	private timerOfLastUpdate: NodeJS.Timeout | undefined;

	public readonly showButtonToClearCache = new BooleanState(false);

	/**
	 *
	 * @param page
	 */
	public isNaN(page: number): boolean {
		return isNaN(page);
	}

	public ngOnChanges(changes: { tableState: SimpleChange }): void {
		if (changes.tableState) {
			const tableState = this.tableState();
			if (tableState) {
				this.initTimerOfLastUpdate();
				this.pages = getPaginationItems(tableState.page, tableState.maxPage, environment.config.pagination.maxLength);
				this.changeDetectorRef.detectChanges();
			}
		}
	}

	public nextPage(): void {
		const tableState = this.tableState();
		if (tableState) {
			if (tableState.page < tableState.maxPage) {
				this.changePage(tableState.page + 1);
			}
		}
	}

	public prevPage(): void {
		const tableState = this.tableState();
		if (tableState) {
			if (tableState.page > 1) {
				this.changePage(tableState.page - 1);
			}
		}
	}

	public changePage(page: number): void {
		this.page.emit(page);
	}

	public changePageSize(pageSize: number): void {
		this.pageSize.emit(pageSize);
	}

	private initTimerOfLastUpdate() {

		this.updateLastUpdate();
		this.changeDetectorRef.detectChanges();

		if (this.timerOfLastUpdate) {
			clearInterval(this.timerOfLastUpdate);
		}

		this.timerOfLastUpdate = setTimeout(() => {
			this.initTimerOfLastUpdate();
		}, MS_ONE_MINUTE);

	}

	private updateLastUpdate(): void {
		const tableState = this.tableState();
		if (tableState) {

			const ms = DateTime.now().diff(DateTime.fromISO(tableState.lastUpdate)).as('milliseconds');

			if (ms > MS_ONE_MINUTE) {
				this.showButtonToClearCache.switchOn();
			} else {
				this.showButtonToClearCache.switchOff();
			}

			this.lastUpdate = humanizeDuration(
				ms,
				{
					round: true,
					units: ['m'],
					language: this.translateService.currentLang,
				}
			);

		}

	}

}
