import {Component, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/components/getting-started/getting-started.component';
import {ExampleTableComponent} from '@utility/presentation/components/table/example.table.component';

@Component({
  selector: 'employee-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent
  ],
  standalone: true
})
export default class Index {

}
