import {Component, Input} from "@angular/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'utility-sort-indicator',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <i class="bi"
       *ngIf="show"
       [class.bi-sort-alpha-down]="asc"
       [class.bi-sort-alpha-up]="!asc"></i>
  `
})
export class SortIndicatorComponent {
  @Input()
  public show = false;

  @Input()
  public asc = false;
}
