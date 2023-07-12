import {Component, Input} from "@angular/core";
import {NgIf} from "@angular/common";
import {ITableState} from "@utility/domain/table.state";

@Component({
  selector: 'utility-sort-indicator',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <i class="bi"
       *ngIf="tableState.orderBy === orderBy"
       [class.bi-sort-alpha-down]="tableState.orderDir === 'asc'"
       [class.bi-sort-alpha-up]="tableState.orderDir === 'desc'"></i>
  `
})
export class SortIndicatorComponent {
  @Input()
  public tableState!: ITableState<any>;

  @Input()
  public orderBy!: string;
}
