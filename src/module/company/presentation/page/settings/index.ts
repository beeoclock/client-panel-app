import {Component, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/component/getting-started/getting-started.component';
import {DangerZoneComponent} from '@company/presentation/component/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@company/presentation/component/change-password/change-password.component';
import {FormSettingsComponent} from '@company/presentation/component/settings/form.settings.component';

@Component({
  selector: 'company-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    GettingStartedComponent,
    DangerZoneComponent,
    ChangePasswordComponent,
    FormSettingsComponent
  ],
  standalone: true
})
export default class Index {
}
