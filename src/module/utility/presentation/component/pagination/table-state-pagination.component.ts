import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  ViewEncapsulation,
  input
} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ITableState} from "@utility/domain/table.state";
import humanizeDuration from "humanize-duration";
import {DateTime} from "luxon";
import {getPaginationItems} from "@utility/domain/pagination.items";
import {environment} from "@environment/environment";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MS_ONE_MINUTE} from "@utility/domain/const/c.time";
import {BooleanState} from "@utility/domain";

@Component({
  selector: 'utility-table-state-pagination-component',
  standalone: true,
  templateUrl: './table-state-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    TranslateModule,
  ],
  encapsulation: ViewEncapsulation.None
})
export class TableStatePaginationComponent implements OnChanges {

  @Input()
  public tableState!: ITableState<unknown>;

  public readonly mobileMode = input(false);

  @Output()
  public readonly pageSize = new EventEmitter();

  @Output()
  public readonly page = new EventEmitter();

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
      this.initTimerOfLastUpdate();
      this.pages = getPaginationItems(this.tableState.page, this.tableState.maxPage, environment.config.pagination.maxLength);
      this.changeDetectorRef.detectChanges();
    }
  }

  public nextPage(): void {
    this.changePage(this.tableState.page + 1);
  }

  public prevPage(): void {
    this.changePage(this.tableState.page - 1);
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

    const ms = DateTime.now().diff(DateTime.fromISO(this.tableState.lastUpdate)).as('milliseconds');

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
