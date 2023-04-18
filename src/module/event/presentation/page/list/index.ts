import {Component, ViewEncapsulation} from '@angular/core';
import {ExampleTableComponent} from '@utility/presentation/component/table/example.table.component';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'event-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ExampleTableComponent,
    ButtonComponent,
    RouterLink
  ],
  standalone: true
})
export default class Index {

}
