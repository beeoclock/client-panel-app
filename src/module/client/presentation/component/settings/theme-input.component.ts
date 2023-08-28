import {Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";

enum ThemeEnum {
  light = 'light',
  dark = 'dark'
}

@Component({
  selector: 'client-settings-theme-input-component',
  standalone: true,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  template: `
    <label class="dark:text-beeDarkColor-300 block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">
      {{ 'keyword.capitalize.theme' | translate }}
    </label>
    <ng-select
      id="client-settings-form-theme"
      [items]="themes"
      [clearable]="false"
      [formControl]="control">
      <ng-template ng-label-tmp let-item="item" let-clear="clear">
        {{ 'theme.' + item | translate }}
      </ng-template>
      <ng-template ng-option-tmp let-item="item" let-clear="clear">
        {{ 'theme.' + item | translate }}
      </ng-template>
    </ng-select>
  `
})
export class ThemeInputComponent {

  public readonly control = new FormControl();
  public readonly translateService = inject(TranslateService);

  public readonly themes = Object.values(ThemeEnum);

  constructor() {
    this.control.setValue(localStorage.getItem('theme') ?? 'light');
    this.control.valueChanges.subscribe((theme) => {
      document.documentElement.setAttribute("data-bs-theme", theme);
      if (theme === ThemeEnum.dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    });
  }

}
