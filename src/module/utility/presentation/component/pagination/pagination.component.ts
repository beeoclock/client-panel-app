import {Component, ViewEncapsulation} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'utility-pagination-component',
  standalone: true,
  templateUrl: 'pagination.component.html',
  imports: [
    NgSelectModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent {

}
