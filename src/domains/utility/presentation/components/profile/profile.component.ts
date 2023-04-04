import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Auth} from '@angular/fire/auth';

@Component({
  selector: 'utility-profile-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <a aria-expanded="false" aria-haspopup="true" class="nav-link pe-0 ps-2"
       data-bs-toggle="dropdown" id="navbarDropdownUser" role="button">
      <div class="avatar avatar-xl">
        <img alt="" class="rounded-circle" src="assets/img/logo.png"/>

      </div>
    </a>
    <div aria-labelledby="navbarDropdownUser"
         class="dropdown-menu dropdown-caret dropdown-caret dropdown-menu-end py-0">
      <div class="bg-white dark__bg-1000 rounded-2 py-2">

        <a class="dropdown-item" href="#!">Set status</a>
        <a class="dropdown-item" href="/">Profile &amp; account</a>
        <a class="dropdown-item" href="#!">Feedback</a>

        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="/">Settings</a>
        <button class="dropdown-item" (click)="signOut()">Logout</button>
      </div>
    </div>
  `
})
export class ProfileComponent {

  private readonly auth: Auth = inject(Auth);

  public signOut(): void {
    // TODO ask if user really want to sign out!
    this.auth.signOut()
      .then(() => {
        console.log('Sign out!');
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
