import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'tbody[utility-body-table-component]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class BodyTableComponent {

  @HostBinding()
  public readonly class = 'list';

  @HostBinding()
  public readonly id = 'table-purchase-body';
}
