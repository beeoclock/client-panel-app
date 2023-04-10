import {Component, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/components/getting-started/getting-started.component';
import {DangerZoneComponent} from '@company/presentation/components/danger-zone/danger-zone.component';
import {ChangePasswordComponent} from '@company/presentation/components/change-password/change-password.component';
import {FormSettingsComponent} from '@company/presentation/components/settings/form.settings.component';

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
