import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {Auth} from '@angular/fire/auth';
import {StreamToastComponent} from '@utility/presentation/component/toast/stream.toast.component';

@Component({
  selector: 'utility-wrapper-identity-component',
  standalone: true,
  template: `
    <div class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
      <router-outlet></router-outlet>
      <utility-stream-toast-component></utility-stream-toast-component>
    </div>
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

