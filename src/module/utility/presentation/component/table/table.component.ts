import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'utility-table-component',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="table-responsive scrollbar">
      <table class="table table-striped fs--1 mb-0 overflow-hidden rounded">
        <ng-content/>
      </table>
    </div>
  `
})
export class TableComponent {

}
