import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'client-account-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    TranslateModule
  ],
  template: `
    <card>
      <span class="text-2xl font-bold text-beeColor-500">{{ 'keyword.capitalize.account' | translate }}</span>

    </card>
  `
})
export class AccountSettingsComponent {

}
