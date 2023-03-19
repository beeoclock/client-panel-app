import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `{{title}}
  <router-outlet></router-outlet>`,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'client-panel-app';
}
