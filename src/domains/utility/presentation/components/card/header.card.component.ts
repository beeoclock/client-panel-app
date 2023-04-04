import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-header-card-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="card-header">
      <div class="row flex-between-end">
        <div class="col-auto align-self-center">
          <h5 class="mb-0" data-anchor="data-anchor" id="filter-example">
            Customers
          </h5>
        </div>
      </div>
    </div>
  `
})
export class HeaderCardComponent {

}
