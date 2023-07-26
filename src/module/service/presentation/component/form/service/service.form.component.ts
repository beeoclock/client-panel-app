import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@service/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';

import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';
import {
  LanguageServiceFormComponent
} from '@service/presentation/component/form/service/language.service.form.component';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'service-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    TextareaDirective,
    NgSelectModule,
    IsRequiredDirective,
    LanguageServiceFormComponent,
    FormInputComponent,
    TranslateModule,
  ],
  template: `
    <form [formGroup]="form" class="flex flex-col gap-3">

      <service-language-service-form-component
        [control]="form.controls.language">
      </service-language-service-form-component>

      <form-input
        id="service-form-title"
        autocomplete="service.title"
        placeholder="Write title of service"
        [control]="form.controls.title"
        [label]="'general.title' | translate">
      </form-input>

      <form-input
        id="service-form-description"
        autocomplete="service.description"
        placeholder="Write description of service"
        [control]="form.controls.description"
        [label]="'general.description' | translate">
      </form-input>

    </form>
  `
})
export class ServiceFormComponent {

  @Input()
  public form = new LanguageVersionForm();


}
