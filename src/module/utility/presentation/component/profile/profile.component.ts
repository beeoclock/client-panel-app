import {AfterViewInit, Component, ElementRef, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {Dropdown, DropdownOptions} from "flowbite";
import {Router, RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {Select} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/state/identity/identity.state";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {Observable} from "rxjs";


@Component({
  selector: 'utility-profile-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    JsonPipe,
    AsyncPipe
  ],
  template: `

    <button
      #dropdownProfileAvatarButton
      id="dropdownAvatarNameButton" data-dropdown-toggle="dropdownAvatarName"
      class="flex items-center text-sm font-medium rounded-full hover:text-blue-600 dark:hover:text-blue-500 focus:ring-4 focus:ring-beeColor-600 dark:focus:ring-beeDarkColor-700 dark:text-white"
      type="button">
      <span class="sr-only">Open user menu</span>
      <div class="w-8 h-8 rounded-full bg-beeColor-200 text-2xl text-beeColor-700">
        <i class="bi bi-person-circle"></i>
      </div>
      <!--      <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="user photo">-->
    </button>

    <!-- Dropdown menu -->
    <div
      #dropdownProfileAvatarMenu
      id="dropdownAvatarName"
      class="z-10 hidden bg-white divide-y divide-beeColor-100 rounded-lg shadow w-48 dark:bg-beeDarkColor-700 dark:divide-beeDarkColor-600">
      <div class="px-4 py-3 text-sm text-beeColor-900 dark:text-white">
        <div class="font-medium">
          {{ (token$ | async)?.claims?.name }}
        </div>
        <div class="truncate">{{ (token$ | async)?.claims?.email }}</div>
      </div>
      <ul class="py-2 text-sm text-beeColor-700 dark:text-beeDarkColor-200"
          aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton">
        <li>
          <a routerLink="/client/settings"
             (click)="hideDropdown()"
             class="block px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
            {{ 'sidebar.settings' | translate }}
          </a>
        </li>
        <li>
          <a routerLink="/identity/corridor"
             [queryParams]="{force: true}"
             (click)="hideDropdown()"
             class="block px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
            {{ 'sidebar.switch-business-client' | translate }}
          </a>
        </li>
      </ul>
      <div class="py-2">
        <button
          (click)="signOut()"
          class="block w-full text-start px-4 py-2 text-sm text-beeColor-700 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:text-beeDarkColor-200 dark:hover:text-white">
          {{ 'keyword.capitalize.logout' | translate }}
        </button>
      </div>
    </div>

  `
})
export class ProfileComponent implements AfterViewInit {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  @Select(IdentityState.token)
  public token$!: Observable<BeeoclockIdTokenResult>;

  public dropdown: Dropdown | undefined;

  @ViewChild('dropdownProfileAvatarButton')
  public dropdownProfileAvatarButton!: ElementRef<HTMLButtonElement>;

  @ViewChild('dropdownProfileAvatarMenu')
  public dropdownProfileAvatarMenu!: ElementRef<HTMLDivElement>;

  public ngAfterViewInit(): void {

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom-start',
      triggerType: 'click',
    };

    /*
    * targetEl: required
    * triggerEl: required
    * options: optional
    */
    this.dropdown = new Dropdown(
      this.dropdownProfileAvatarMenu.nativeElement,
      this.dropdownProfileAvatarButton.nativeElement,
      options
    );

  }

  public hideDropdown(): void {
    this.dropdown?.hide();
  }

  public signOut(): void {
    this.hideDropdown();
    // TODO ask if user really want to sign out!
    this.auth.signOut()
      .then(() => {
        console.log('Sign out!');
        this.router.navigate(['/']);

      })
      .catch((error) => {
        console.error(error);
      });
  }

}
