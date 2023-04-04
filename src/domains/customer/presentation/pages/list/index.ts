import {Component, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/components/table/example.table.component';

@Component({
  selector: 'customer-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent
  ],
  standalone: true
})
export default class Index {

}
