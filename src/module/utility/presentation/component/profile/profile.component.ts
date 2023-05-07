import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {Dropdown} from "bootstrap";


@Component({
  selector: 'utility-profile-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <a class="nav-link pe-0 ps-2"
       data-bs-toggle="dropdown" id="navbarDropdownUser" role="button">
      <div class="avatar avatar-xl">
        <img alt="" class="rounded-circle" src="asset/img/logo.png"/>

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
export class ProfileComponent implements OnInit {

  private readonly auth = inject(Auth);
  public dropdown: Dropdown | undefined;

  public ngOnInit(): void {

    this.dropdown = new Dropdown('utility-profile-component > #navbarDropdownUser', {

    });

  }

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
