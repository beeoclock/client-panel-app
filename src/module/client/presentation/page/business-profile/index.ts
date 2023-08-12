import {Component, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {SettingsForm} from "@client/form/settings.form";
import {TranslateModule} from "@ngx-translate/core";
import {
  CoverImageBusinessProfileComponent
} from "@client/presentation/component/business-profile/cover-image/cover-image.business-profile.component";
import {FormSettingsComponent} from "@client/presentation/component/business-profile/form.settings.component";
import {
  LogoBusinessProfileComponent
} from "@client/presentation/component/business-profile/logo/logo.business-profile.component";

@Component({
  selector: 'client-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormSettingsComponent,
    ReactiveFormsModule,
    TranslateModule,
    CoverImageBusinessProfileComponent,
    LogoBusinessProfileComponent
  ],
  standalone: true
})
export default class Index {

  public readonly form = new SettingsForm();

}
