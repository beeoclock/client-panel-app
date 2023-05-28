import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';

import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'service-title-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,

    HasErrorDirective,
    InputDirective,
    IsRequiredDirective,
    InvalidTooltipDirective,
  ],
  template: `
    <div class="mb-2 flex-col">
      <label for="service-form-title" class="form-label">Title</label>
      <input
        isRequired
        hasError
        invalidTooltip
        class="border rounded px-3 py-2 w-full"
        placeholder="Write title of service"
        id="service-form-title"
        [formControl]="control">
    </div>
  `
})
export class TitleServiceFormComponent {

  @Input()
  public control = new FormControl();


}
