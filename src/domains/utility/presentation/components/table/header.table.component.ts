import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {PaginationComponent} from '@utility/presentation/components/pagination/pagination.component';
import {CardComponent} from '@utility/presentation/components/card/card.component';

@Component({
  selector: 'thead[utility-header-table-component]',
  standalone: true,
  imports: [
    PaginationComponent,
    CardComponent
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class HeaderTableComponent {

  @HostBinding()
  public readonly class = 'bg-200 text-900';
}
