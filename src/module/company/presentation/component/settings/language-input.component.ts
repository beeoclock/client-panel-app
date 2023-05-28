import {Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {LANGUAGES} from "@utility/domain/enum";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'company-settings-language-input-component',
  standalone: true,
  imports: [
    NgSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <ng-select
      id="service-form-language"
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
      console.log(languageCode);
      this.translateService.use(languageCode);
    });
  }

}
