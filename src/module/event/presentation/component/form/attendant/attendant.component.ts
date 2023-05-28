import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AttendantForm} from '@event/form/event.form';

import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'event-attendant-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    NgIf,
    HasErrorDirective,
    IsRequiredDirective,
    InvalidTooltipDirective
  ],
  template: `
    <form [formGroup]="form" class="mb-4">
      <label [for]="prefix + index">E-mail</label>
      <div class="flex">
        <input
          [id]="prefix + index"
          hasError
          invalidTooltip
          isRequired
          type="email"
          formControlName="email"
          placeholder="E-mail"
          aria-label="E-mail"
          [class.rounded-none]="showRemoveButton"
          [class.rounded-l]="showRemoveButton"
          [class.rounded]="!showRemoveButton"
          class="
            bg-gray-50
            border
            text-gray-900
            focus:ring-blue-500
            focus:border-blue-500
            block
            flex-1
            min-w-0
            w-full
            text-sm
            border-gray-300
            px-3
            py-2
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:text-white
            dark:focus:ring-blue-500
            dark:focus:border-blue-500">
        <button
          *ngIf="showRemoveButton"
          (click)="removeEvent.emit()"
          class="
            text-red-500
            inline-flex
            items-center
            px-3
            text-sm
            text-gray-900
            bg-gray-200
            border
            border-l-0
            border-gray-300
            rounded-r
            hover:bg-red-100
            dark:bg-gray-600
            dark:text-gray-400
            dark:border-gray-600">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </form>
  `
})
export class AttendantComponent {

  @Input()
  public form!: AttendantForm;

  @Input()
  public showRemoveButton = false;

  @Input()
  public index = 0;

  @Output()
  public removeEvent: EventEmitter<void> = new EventEmitter<void>();

  public readonly prefix = 'event-attendant-component-';

}
