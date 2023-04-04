import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-body-card-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="card-body p-0">
      <ng-content></ng-content>
    </div>
  `
})
export class BodyCardComponent {

}
