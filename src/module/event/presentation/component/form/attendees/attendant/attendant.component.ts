import {Component, Input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/presentation/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {CustomerForm} from "@customer/presentation/form";
import {
	CustomerAutocompleteDirective
} from "@utility/presentation/directives/customer-autocomplete/customer-autocomplete.directive";

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
    TranslateModule,
    CustomerAutocompleteDirective
  ],
  template: `
    <div class="grid grid-cols-2 gap-4">

      <form-input
        type="text"
        customerAutocomplete
        autocomplete="off"
				id="attendee-first-name"
        [placeholder]="'keyword.capitalize.firstName' | translate"
        [control]="form.controls.firstName"
        [label]="'keyword.capitalize.firstName' | translate"/>

      <form-input
        type="text"
        customerAutocomplete
        autocomplete="off"
				id="attendee-last-name"
        [placeholder]="'keyword.capitalize.lastName' | translate"
        [control]="form.controls.lastName"
        [label]="'keyword.capitalize.lastName' | translate"/>

      <form-input
        type="email"
        customerAutocomplete
        autocomplete="off"
        placeholder="firstname.lastname@example.com"
				id="attendee-email"
        [control]="form.controls.email"
        [label]="'keyword.capitalize.email' | translate"/>

      <form-input
        type="phone"
        customerAutocomplete
        autocomplete="off"
        placeholder="+000000000000"
				id="attendee-phone"
        [control]="form.controls.phone"
        [label]="'keyword.capitalize.phone' | translate"/>

    </div>
  `
})
export class AttendantComponent {

  @Input()
  public form!: CustomerForm;

}
