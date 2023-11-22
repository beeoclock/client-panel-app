import {Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LANGUAGES} from "@utility/domain/enum";
import {NgSelectModule} from "@ng-select/ng-select";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
  selector: 'client-settings-language-input-component',
  standalone: true,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
  template: `
    <label default>
      {{ 'keyword.capitalize.language' | translate }}
    </label>
    <ng-select
      id="client-settings-form-language"
      bindLabel="name"
      bindValue="code"
      [items]="languages"
      [clearable]="false"
      [formControl]="control">
    </ng-select>
  `
})
export class LanguageInputComponent {

  public readonly control = new FormControl();
  public readonly translateService = inject(TranslateService);
  public readonly languages = LANGUAGES;

  constructor() {
    this.control.setValue(this.translateService.currentLang);
    this.control.valueChanges.subscribe((languageCode) => {
      this.translateService.use(languageCode);
			// TODO: Delete reload when the language change will be fixed
			window.location.reload();
    });
  }

}
