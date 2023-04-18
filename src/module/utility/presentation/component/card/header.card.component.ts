import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-header-card-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="card-header">
      <ng-content></ng-content>
    </div>
  `
})
export class HeaderCardComponent {

}
