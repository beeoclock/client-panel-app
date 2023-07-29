import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AttendantForm} from '@event/form/event.form';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {TranslateModule} from "@ngx-translate/core";

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
    <form [formGroup]="form" class="">
      <div class="grid grid-cols-2 gap-4">

        <form-input
          id="email"
          type="email"
          autocomplete="email"
          placeholder="firstname.lastname@example.com"
          [control]="form.controls.email"
          [label]="'general.email' | translate">
        </form-input>

        <form-input
          id="phone"
          type="phone"
          autocomplete="phone"
          placeholder="+000000000000"
          [control]="form.controls.phone"
          [label]="'general.phone' | translate">
        </form-input>

        <form-input
          id="firstName"
          type="firstName"
          autocomplete="firstName"
          placeholder="First name"
          [control]="form.controls.firstName"
          [label]="'general.firstName' | translate">
        </form-input>

        <form-input
          id="lastName"
          type="lastName"
          autocomplete="lastName"
          placeholder="Last name"
          [control]="form.controls.lastName"
          [label]="'general.lastName' | translate">
        </form-input>

      </div>
    </form>
  `
})
export class AttendantComponent {

  @Input()
  public form!: AttendantForm;

  @Input()
  public showRemoveButton = true;

  @Input()
  public index = 0;

  @Output()
  public removeEvent: EventEmitter<void> = new EventEmitter<void>();

  public readonly prefix = 'event-attendant-component-';

}
