import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {DangerZoneComponent} from '@module/client/presentation/component/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@module/client/presentation/component/change-password/change-password.component';
import {DeleteButtonComponent} from "@utility/presentation/component/button/delete.button.component";
import {Auth} from "@angular/fire/auth";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LanguageInputComponent} from "@module/client/presentation/component/settings/language-input.component";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {AccountSettingsComponent} from "@client/presentation/component/settings/account/account.settings.component";
import {GeneralSettingsComponent} from "@client/presentation/component/settings/general/general.settings.component";

@Component({
  selector: 'client-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    DangerZoneComponent,
    ChangePasswordComponent,
    DeleteButtonComponent,
    ReactiveFormsModule,
    LanguageInputComponent,
    TranslateModule,
    AccountSettingsComponent,
    GeneralSettingsComponent
  ],
  standalone: true
})
export default class Index {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  public readonly darkModeControl = new FormControl(false);

  @HostBinding()
  public readonly class = 'p-4 block';

  constructor() {
    const value = (localStorage.getItem('theme') ?? 'light') === 'dark';
    this.darkModeControl.setValue(value);
    this.darkModeControl.valueChanges.subscribe((controlValue) => {
      const newValue = controlValue ? 'dark' : 'light';
      document.documentElement.setAttribute("data-bs-theme", newValue);
      if (controlValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newValue);
    });
  }

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
