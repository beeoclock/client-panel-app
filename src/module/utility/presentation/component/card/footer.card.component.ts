import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-footer-card-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <ng-content></ng-content>
  `
})
export class FooterCardComponent {
  @HostBinding()
  public readonly class = ['card-footer', 'rounded', 'bg-light'];
}
