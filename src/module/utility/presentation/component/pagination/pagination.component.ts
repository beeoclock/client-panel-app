import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {Pagination} from "@utility/domain";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

// TODO move the coe to single file
const SECONDS_MILLISECOND = 1_000;
const DAY_MILLISECONDS = SECONDS_MILLISECOND * 60 * 60 * 24;

@Component({
  selector: 'utility-pagination-component',
  standalone: true,
  templateUrl: 'pagination.component.html',
  imports: [
    NgSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    RouterLink,
  ],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent {

  @Input()
  public pagination = new Pagination<any>();

  /**
   *
   * @param page
   */
  public isNaN(page: number): boolean {
    return isNaN(page);
  }

  /**
   * TODO move the function to single file
   * @param date
   * @param unit
   */
  public getRelativeTime(date: Date, unit = 'seconds'): string {
    const rtf = new Intl.RelativeTimeFormat('en', {
      numeric: 'auto',
    });
    const daysDifference = Math.round(
      (new Date().getTime() - date.getTime()) / (unit === 'seconds' ? SECONDS_MILLISECOND : DAY_MILLISECONDS),
    );

    return rtf.format(daysDifference, 'seconds');
  }

}
