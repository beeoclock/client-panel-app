import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Auth} from '@angular/fire/auth';
import {StreamToastComponent} from '@utility/presentation/component/toast/stream.toast.component';

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <main class="main" id="top">
      <div class="container" data-layout="container">
        <router-outlet></router-outlet>
        <utility-stream-toast-component></utility-stream-toast-component>
      </div>
    </main>

  `,
  imports: [RouterOutlet, StreamToastComponent],
  encapsulation: ViewEncapsulation.None
})
export default class WrapperIdentityComponent {

  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  constructor() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/', 'dashboard']);
      }
    });
  }

}

