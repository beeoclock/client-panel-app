import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LanguageVersionForm} from '@service/presentation/form/service.form';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {
	LanguageServiceFormComponent
} from '@service/presentation/component/form/v1/service/language.service.form.component';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'service-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgSelectModule,
    IsRequiredDirective,
    LanguageServiceFormComponent,
    FormInputComponent,
    TranslateModule,
  ],
  template: `
    <form [formGroup]="form" class="flex flex-col gap-3">

      <service-language-service-form-component
        [control]="form.controls.language"/>

      <form-input
        id="service-form-title"
        autocomplete="service.title"
        placeholder="Write title of service"
        [control]="form.controls.title"
        [label]="'keyword.capitalize.title' | translate"/>

      <form-input
        id="service-form-description"
        autocomplete="service.description"
        placeholder="Write description of service"
        [control]="form.controls.description"
        [label]="'keyword.capitalize.description' | translate"/>

    </form>
  `
})
export class ServiceFormComponent {

  @Input()
  public form = new LanguageVersionForm();


}
