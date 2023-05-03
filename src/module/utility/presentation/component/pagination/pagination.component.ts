import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {Pagination} from "@utility/domain";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'utility-pagination-component',
  standalone: true,
  templateUrl: 'pagination.component.html',
  imports: [
    NgSelectModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent {

  @Input()
  public pagination = new Pagination<any>();

  public readonly paginationRef = Pagination;

  public change($event: Event): void {
    const target: HTMLOptionElement = $event.target as any;
    this.pagination.setPageSize(+target.value);
  }
}
