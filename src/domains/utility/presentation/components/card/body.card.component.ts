import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-body-card-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <ng-content></ng-content>
  `
})
export class BodyCardComponent {
  @HostBinding()
  public readonly class = ['card-body', 'bg-light'];
}
