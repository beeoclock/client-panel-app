import {Component, inject, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/component/getting-started/getting-started.component';
import {DangerZoneComponent} from '@company/presentation/component/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@company/presentation/component/change-password/change-password.component';
import {FormSettingsComponent} from '@company/presentation/component/settings/form.settings.component';
import {ButtonComponent} from "@utility/presentation/component/button/button.component";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'company-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
    imports: [
        GettingStartedComponent,
        DangerZoneComponent,
        ChangePasswordComponent,
        FormSettingsComponent,
        ButtonComponent
    ],
  standalone: true
})
export default class Index {

  private readonly auth = inject(Auth);
  public logout(): void {
    this.auth.signOut()
      .then(() => {

      })
      .catch((error) => {
        console.log(error);
      });
  }
}
