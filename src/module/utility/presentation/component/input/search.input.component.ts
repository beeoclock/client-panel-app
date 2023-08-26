import {Component, inject, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'utility-search-input-component',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <input type="text" [formControl]="control" class="rounded-md px-3 py-2 border dark:bg-beeDarkColor-800 dark:border-beeDarkColor-700 dark:text-white outline-0 focus:ring-2" [placeholder]="placeholder">
  `
})
export class SearchInputComponent {

  @Input()
  public control: FormControl = new FormControl();

  public readonly translateService = inject(TranslateService);

  @Input()
  public placeholder = this.translateService.instant('keyword.capitalize.placeholder.search');

}
