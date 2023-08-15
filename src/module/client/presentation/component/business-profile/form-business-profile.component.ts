import {Component, Input, ViewEncapsulation} from '@angular/core';
import {InputDirective} from '@utility/directives/input/input.directive';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {BusinessProfileForm} from '@client/form/business-profile.form';
import {ReactiveFormsModule} from '@angular/forms';
import {SpinnerComponent} from '@utility/presentation/component/spinner/spinner.component';
import {NgForOf, NgIf} from '@angular/common';
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/business-category.component";

@Component({
  selector: 'client-business-profile-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputDirective,
    InputDirective,
    InputDirective,
    DeleteButtonComponent,
    ReactiveFormsModule,
    SpinnerComponent,
    NgIf,
    LoaderComponent,
    NgForOf,
    TranslateModule,
    CardComponent,
    FormInputComponent,
    FormTextareaComponent,
    PriceAndCurrencyComponent
  ],
  template: `
    <card>

      <strong class="dark:text-white">{{ 'client.profile.title' | translate }}</strong>

      <form-input
        id="business-profile-form-name-input"
        type="text"
        autocomplete="name"
        [placeholder]="'client.profile.form.inputs.name.placeholder' | translate"
        [control]="form.controls.name"
        [label]="'client.profile.form.inputs.name.label' | translate">
      </form-input>

      <form-textarea-component
        id="business-profile-form-description-input"
        [label]="'client.profile.form.inputs.description.label' | translate"
        [placeholder]="'client.profile.form.inputs.description.placeholder' | translate"
        [control]="form.controls.description">
      </form-textarea-component>

      <business-category-select-component
        id="business-profile-form-businessCategory-input"
        [control]="form.controls.businessCategory">
      </business-category-select-component>

      <form-input
        id="business-profile-form-feature"
        type="text"
        autocomplete="feature"
        [placeholder]="'client.profile.form.inputs.description.placeholder' | translate"
        [control]="form.controls.feature"
        [label]="'client.profile.form.inputs.feature.label' | translate">
      </form-input>

    </card>
  `
})
export class FormBusinessProfileComponent {

  @Input()
  public form = new BusinessProfileForm();

}
