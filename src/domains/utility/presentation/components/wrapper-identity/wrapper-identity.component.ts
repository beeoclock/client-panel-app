import {Component, ViewEncapsulation} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <main class="main" id="top">
      <div class="container" data-layout="container">
        <router-outlet></router-outlet>
      </div>
    </main>

  `,
  imports: [RouterOutlet],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

}

