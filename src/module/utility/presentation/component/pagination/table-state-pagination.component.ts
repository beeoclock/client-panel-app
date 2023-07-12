import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ITableState} from "@utility/domain/table.state";

// TODO move the coe to single file
const SECONDS_MILLISECOND = 1_000;
const DAY_MILLISECONDS = SECONDS_MILLISECOND * 60 * 60 * 24;

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
export class TableStatePaginationComponent {

  @Input()
  public tableState!: ITableState<any>;

  /**
   *
   * @param page
   */
  public isNaN(page: number): boolean {
    return isNaN(page);
  }

  /**
   * TODO move the function to single file
   * @param dateString
   * @param unit
   */
  public getRelativeTime(dateString: string, unit = 'seconds'): string {
    const rtf = new Intl.RelativeTimeFormat('en', {
      numeric: 'auto',
    });
    const daysDifference = Math.round(
      (new Date().getTime() - (new Date(dateString)).getTime()) / (unit === 'seconds' ? SECONDS_MILLISECOND : DAY_MILLISECONDS),
    );

    return rtf.format(daysDifference, 'seconds');
  }

  prevPage() {

  }

  nextPage() {

  }
}
