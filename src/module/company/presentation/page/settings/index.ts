import {Component, inject, ViewEncapsulation} from '@angular/core';
import {DangerZoneComponent} from '@company/presentation/component/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@company/presentation/component/change-password/change-password.component';
import {FormSettingsComponent} from '@company/presentation/component/settings/form.settings.component';
import {ButtonComponent} from "@utility/presentation/component/button/button.component";
import {Auth} from "@angular/fire/auth";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'company-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    DangerZoneComponent,
    ChangePasswordComponent,
    FormSettingsComponent,
    ButtonComponent,
    ReactiveFormsModule
  ],
  standalone: true
})
export default class Index {

  private readonly auth = inject(Auth);

  public readonly darkModeControl = new FormControl(false);

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

      })
      .catch((error) => {
        console.log(error);
      });
  }
}
