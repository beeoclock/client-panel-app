import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@service/form/service.form';
import {LanguageCodeEnum} from '@utility/domain/enum';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {NgSelectModule} from '@ng-select/ng-select';

@Component({
  selector: 'service-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    HasErrorModule,
    InputErrorComponent,
    TextareaDirective,
    NgSelectModule
  ],
  template: `
    <form [formGroup]="languageVersionForm">

      <div class="col-12 position-relative">

        <div class="col-12 position-relative">
          <label for="service-form-language">Language</label>
          <ng-select [items]="languageList"
                     id="service-form-language"
                     bindLabel="name"
                     bindValue="id"
                     formControlName="language">
          </ng-select>
          <utility-input-error-component [control]="languageVersionForm.controls.language"></utility-input-error-component>
        </div>

        <label for="service-form-title">Title</label>
        <input
          beeoclock
          hasError
          placeholder="Write title of service"
          id="service-form-title"
          formControlName="title">
        <utility-input-error-component
          [control]="languageVersionForm.controls.title"></utility-input-error-component>
      </div>
      <div class="col-12">
        <label for="service-form-description">Description</label>
        <textarea
          beeoclock
          hasError
          placeholder="Write some description of service"
          id="service-form-description"
          formControlName="description"></textarea>
        <utility-input-error-component
          [control]="languageVersionForm.controls.description"></utility-input-error-component>
      </div>
    </form>
  `
})
export class ServiceFormComponent {

  @Input()
  public languageVersionForm: LanguageVersionForm = new LanguageVersionForm();

  public readonly languageList = Object.values(LanguageCodeEnum).map((language) => ({
    id: language,
    name: language
  }));

}
