import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@service/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';
import {
  LanguageServiceFormComponent
} from '@service/presentation/component/form/service/language.service.form.component';
import {TitleServiceFormComponent} from '@service/presentation/component/form/service/title.service.form.component';
import {
  DescriptionServiceFormComponent
} from '@service/presentation/component/form/service/description.service.form.component';

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
    IsRequiredDirective,
    LanguageServiceFormComponent,
    TitleServiceFormComponent,
    DescriptionServiceFormComponent,
  ],
  template: `
    <form [formGroup]="form">

      <service-language-service-form-component
        [control]="form.controls.language">
      </service-language-service-form-component>

      <service-title-service-form-component
        [control]="form.controls.title">
      </service-title-service-form-component>

      <service-description-service-form-component
        [control]="form.controls.description">
      </service-description-service-form-component>
    </form>
  `
})
export class ServiceFormComponent {

  @Input()
  public form = new LanguageVersionForm();


}
