import {Component, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/components/getting-started/getting-started.component';

@Component({
  selector: 'employee-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    GettingStartedComponent
  ],
  standalone: true
})
export default class Index {

}
