import {Component, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

}
