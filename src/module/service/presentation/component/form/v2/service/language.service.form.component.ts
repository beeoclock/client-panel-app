import {Component, input, ViewEncapsulation} from '@angular/core';
import {LANGUAGES} from 'src/core/shared/enum';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'service-language-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,

    NgSelectModule,
  ],
  template: `
    <div class="mb-2 flex-col">
      <label for="service-form-language">Language</label>
      <ng-select [items]="languageList"
                 id="service-form-language"
                 bindLabel="name"
                 bindValue="code"
                 [formControl]="control()">
      </ng-select>
    </div>
  `
})
export class LanguageServiceFormComponent {

  public readonly control = input(new FormControl());

  public readonly languageList = LANGUAGES;

}
