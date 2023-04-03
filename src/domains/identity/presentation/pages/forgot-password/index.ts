import {Component, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/components/getting-started/getting-started.component';

@Component({
  selector: 'identity-forgot-password-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    GettingStartedComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

}
