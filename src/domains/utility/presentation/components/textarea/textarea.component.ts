import {Component, HostBinding, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'textarea[beeoclock]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `
})
export class TextareaComponent {
  @HostBinding()
  public class = ['form-control'];
}
