import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@service/form/service.form';
import {languages} from '@utility/domain/enum';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';

@Component({
  selector: 'service-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    InputErrorComponent,
    TextareaDirective,
    NgSelectModule,
    IsRequiredDirective
  ],
  template: `
    <form [formGroup]="languageVersionForm">

      <div class="col-12 mt-2 position-relative">
        <label for="service-form-language">Language</label>
        <ng-select [items]="languageList"
                   id="service-form-language"
                   bindLabel="name"
                   bindValue="code"
                   formControlName="language">
        </ng-select>
        <utility-input-error-component
          [control]="languageVersionForm.controls.language">
        </utility-input-error-component>
      </div>

      <div class="col-12 mt-2 position-relative">

        <label for="service-form-title" class="form-label">Title</label>
        <input
          isRequired
          beeoclock
          hasError
          placeholder="Write title of service"
          id="service-form-title"
          formControlName="title">
        <utility-input-error-component
          [control]="languageVersionForm.controls.title">
        </utility-input-error-component>
      </div>
      <div class="col-12 mt-2 position-relative">
        <label for="service-form-description">Description</label>
        <textarea
          beeoclock
          hasError
          placeholder="Write some description of service"
          id="service-form-description"
          formControlName="description"></textarea>
        <utility-input-error-component
          [control]="languageVersionForm.controls.description">
        </utility-input-error-component>
      </div>
    </form>
  `
})
export class ServiceFormComponent {

  @Input()
  public languageVersionForm: LanguageVersionForm = new LanguageVersionForm();

  public readonly languageList = languages;

}