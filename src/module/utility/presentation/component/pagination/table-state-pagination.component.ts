import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewEncapsulation} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ITableState} from "@utility/domain/table.state";
import humanizeDuration from "humanize-duration";
import {DateTime} from "luxon";
import {getPaginationItems} from "@utility/domain/pagination.items";
import {environment} from "@environment/environment";

@Component({
  selector: 'utility-table-state-pagination-component',
  standalone: true,
  templateUrl: 'table-state-pagination.component.html',
  imports: [
    NgSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
  encapsulation: ViewEncapsulation.None
})
export class TableStatePaginationComponent implements OnChanges {

  @Input()
  public tableState!: ITableState<any>;

  @Output()
  public readonly pageSize = new EventEmitter();

  @Output()
  public readonly page = new EventEmitter();

  @Output()
  public readonly cache = new EventEmitter();

  public lastUpdate: undefined | string;
  public pages: number[] = [];

  /**
   *
   * @param page
   */
  public isNaN(page: number): boolean {
    return isNaN(page);
  }

  public ngOnChanges(changes: { tableState: SimpleChange }): void {
    if (changes.tableState) {
      this.lastUpdate = humanizeDuration(DateTime.now().diff(DateTime.fromISO(this.tableState.lastUpdate)).as('milliseconds'), {
        round: true
      });
      this.pages = getPaginationItems(this.tableState.page, this.tableState.maxPage, environment.config.pagination.maxLength);
    }
  }

  public refreshCache(): void {
    this.cache.emit(true);
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

}
