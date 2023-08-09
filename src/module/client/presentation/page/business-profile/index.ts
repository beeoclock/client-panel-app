import {Component, ViewEncapsulation} from '@angular/core';
import {FormSettingsComponent} from '@module/client/presentation/component/settings/form.settings.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SettingsForm} from "@client/form/settings.form";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'client-settings-page',
  templateUrl: 'index.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormSettingsComponent,
    ReactiveFormsModule,
    TranslateModule
  ],
  standalone: true
})
export default class Index {

  public readonly form = new SettingsForm();

}
