import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'button[beeoclock-button]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
})
export class ButtonComponent {
  @HostBinding()
  public class = ['btn', 'btn-secondary'];

  @HostBinding()
  public type: 'reset' | 'button' | 'submit' = 'button';
}
