import {Component, ViewEncapsulation} from '@angular/core';
import {HeaderTableComponent} from '@utility/presentation/component/table/header.table.component';
import {CardComponent} from '@utility/presentation/component/card/card.component';
import {BodyCardComponent} from '@utility/presentation/component/card/body.card.component';

@Component({
  selector: 'utility-table-component',
  standalone: true,
  imports: [
    HeaderTableComponent,
    CardComponent,
    BodyCardComponent
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <utility-card-component>
      <utility-body-card-component class="p-0 border">
        <div class="table-responsive scrollbar">
          <table class="table table-striped fs--1 mb-0 overflow-hidden rounded">
            <ng-content></ng-content>
          </table>
        </div>
      </utility-body-card-component>
    </utility-card-component>
  `
})
export class TableComponent {

}
