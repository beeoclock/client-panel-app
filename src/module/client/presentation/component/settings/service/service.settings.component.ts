import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {LanguageInputComponent} from "@client/presentation/component/settings/language-input.component";
import {ThemeInputComponent} from "@client/presentation/component/settings/theme-input.component";

@Component({
  selector: 'client-service-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule,
    ReactiveFormsModule,
    LanguageInputComponent,
    ThemeInputComponent
  ],
  template: `
    <card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.services' | translate }}</span>

      <div class="flex flex-col gap-2">
        <div>
          {{ 'client.settings.defaultData.service.form.inputs.duration.label' | translate }}
        </div>
        <div class="text-beeColor-400">
          {{ 'keyword.capitalize.comingSoon' | translate }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div>
          {{ 'client.settings.defaultData.service.form.inputs.language.label' | translate }}
        </div>
        <div class="text-beeColor-400">
          {{ 'keyword.capitalize.comingSoon' | translate }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div>
          {{ 'client.settings.defaultData.service.form.inputs.price.label' | translate }}
        </div>
        <div class="text-beeColor-400">
          {{ 'keyword.capitalize.comingSoon' | translate }}
        </div>
      </div>

    </card>
  `
})
export class ServiceSettingsComponent {

}
