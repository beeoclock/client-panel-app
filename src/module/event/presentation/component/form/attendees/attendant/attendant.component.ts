import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/form";

@Component({
  selector: 'event-attendant-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HasErrorDirective,
    IsRequiredDirective,
    InvalidTooltipDirective,
    FormInputComponent,
    TranslateModule
  ],
  template: `
    <form [formGroup]="form" class="grid grid-cols-2 gap-4">

      <form-input
        type="firstName"
        autocomplete="firstName"
        [placeholder]="'general.firstName' | translate"
        [control]="form.controls.firstName"
        [label]="'general.firstName' | translate">
      </form-input>

      <form-input
        type="lastName"
        autocomplete="lastName"
        [placeholder]="'general.lastName' | translate"
        [control]="form.controls.lastName"
        [label]="'general.lastName' | translate">
      </form-input>

      <form-input
        type="email"
        autocomplete="email"
        placeholder="firstname.lastname@example.com"
        [control]="form.controls.email"
        [label]="'keyword.capitalize.email' | translate">
      </form-input>

      <form-input
        type="phone"
        autocomplete="phone"
        placeholder="+000000000000"
        [control]="form.controls.phone"
        [label]="'keyword.capitalize.phone' | translate">
      </form-input>

    </form>
  `
})
export class AttendantComponent {

  @Input()
  public form!: CustomerForm;

}
