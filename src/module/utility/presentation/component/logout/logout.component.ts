import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'utility-logout-component',
  standalone: true,
  template: `
    <button
      (click)="logout()"
      class="
        text-red-600
        hover:bg-red-100
        focus:ring-4
        focus:outline-none
        focus:ring-red-400
        font-medium
        rounded-lg
        text-sm
        px-4
        py-2.5
        text-center
        inline-flex
        items-center
        dark:bg-blue-600
        dark:hover:bg-blue-700
        dark:focus:ring-blue-800">
        <span class="me-2">
          <i class="bi bi-box-arrow-left"></i>
        </span>
      {{ 'general.logout' | translate }}
    </button>
  `,
  imports: [
    RouterLink,
    TranslateModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class LogoutComponent {
  public readonly router = inject(Router);
  public readonly auth = inject(Auth);

  public logout(): void {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/'])
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
