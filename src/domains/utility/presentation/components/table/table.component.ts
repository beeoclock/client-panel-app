import {Component, ViewEncapsulation} from '@angular/core';
import {HeaderTableComponent} from '@utility/presentation/components/table/header.table.component';
import {CardComponent} from '@utility/presentation/components/card/card.component';

@Component({
  selector: 'utility-table-component',
  standalone: true,
  imports: [
    HeaderTableComponent,
    CardComponent
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <utility-card-component>
      <div class="table-responsive scrollbar">
        <table class="table table-striped fs--1 mb-0 overflow-hidden rounded">
          <ng-content></ng-content>
        </table>
      </div>
    </utility-card-component>
  `
})
export class TableComponent {

}
