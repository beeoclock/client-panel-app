import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {ButtonComponent} from '@utility/presentation/components/button/button.component';

@Component({
  selector: 'button[beeoclock-primary-button]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
})
export class PrimaryButtonComponent extends ButtonComponent {
  @HostBinding()
  public override class = ['btn', 'btn-primary'];
}
