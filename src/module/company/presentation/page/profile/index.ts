import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {DangerZoneComponent} from '@company/presentation/component/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@company/presentation/component/change-password/change-password.component';
import {FormSettingsComponent} from '@company/presentation/component/settings/form.settings.component';
import {ButtonComponent} from "@utility/presentation/component/button/button.component";

@Component({
  selector: 'company-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    DangerZoneComponent,
    ChangePasswordComponent,
    FormSettingsComponent,
    ButtonComponent
  ],
  standalone: true
})
export default class Index {

  @HostBinding()
  public readonly class = 'p-4 block';
}
