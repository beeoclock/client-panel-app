import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@shared/presentation/ui/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {LanguageInputComponent} from "@tenant/client/presentation/ui/component/settings/language-input.component";
import {ThemeInputComponent} from "@tenant/client/presentation/ui/component/settings/theme-input.component";

@Component({
  selector: 'client-event-settings-component',
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
    <bee-card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.events' | translate }}</span>


      <div class="flex flex-col gap-2">
        <div>
          {{ 'client.settings.defaultData.event.form.inputs.language.label' | translate }}
        </div>
        <div class="text-beeColor-400">
          {{ 'keyword.capitalize.comingSoon' | translate }}
        </div>
      </div>


      <div class="flex flex-col gap-2">
        <div>
          {{ 'client.settings.defaultData.event.form.inputs.service.label' | translate }}
        </div>
        <div class="text-beeColor-400">
          {{ 'keyword.capitalize.comingSoon' | translate }}
        </div>
      </div>

    </bee-card>
  `
})
export class EventSettingsComponent {

}
