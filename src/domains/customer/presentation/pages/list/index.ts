import {Component, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/components/getting-started/getting-started.component';
import {TableComponent} from '@utility/presentation/components/table/table.component';
import {ExampleTableComponent} from '@utility/presentation/components/table/example.table.component';

@Component({
  selector: 'customer-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    GettingStartedComponent,
    TableComponent,
    ExampleTableComponent
  ],
  standalone: true
})
export default class Index {

}
