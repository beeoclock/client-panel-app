import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'input[beeoclock]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class InputComponent {
  @HostBinding()
  public class = ['form-control'];

  @HostBinding()
  public type = 'text';
}
