import {Component, Input, input} from "@angular/core";
import {ITableState} from "@shared/domain/table.state";

@Component({
  selector: 'utility-sort-indicator',
  standalone: true,
  template: `
	  @if (tableState.orderBy === orderBy()) {

		  <i class="bi"
			 [class.bi-sort-alpha-down]="tableState.orderDir === 'asc'"
			 [class.bi-sort-alpha-up]="tableState.orderDir === 'desc'"></i>
	  }
  `
})
export class SortIndicatorComponent {
  @Input()
  public tableState!: ITableState<unknown>;

  public readonly orderBy = input.required<string>();
}
