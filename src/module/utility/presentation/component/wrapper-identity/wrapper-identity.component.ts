import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Auth} from '@angular/fire/auth';

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

  private readonly router: Router = inject(Router);
  private readonly auth: Auth = inject(Auth);

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/', 'dashboard']);
      }
    });
  }

}

