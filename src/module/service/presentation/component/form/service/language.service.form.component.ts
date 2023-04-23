import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LANGUAGES} from '@utility/domain/enum';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'service-language-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    NgSelectModule,
  ],
  template: `
    <div class="col-12 mt-2 position-relative">
      <label for="service-form-language">Language</label>
      <ng-select [items]="languageList"
                 id="service-form-language"
                 bindLabel="name"
                 bindValue="code"
                 [formControl]="control">
      </ng-select>
      <utility-input-error-component
        [control]="control">
      </utility-input-error-component>
    </div>
  `
})
export class LanguageServiceFormComponent {

  @Input()
  public control = new FormControl();

  public readonly languageList = LANGUAGES;

}
