import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {TextareaDirective} from '@utility/directives/textarea/textarea.directive';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'service-description-service-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    TextareaDirective,
    HasErrorDirective,
    InvalidTooltipDirective,

  ],
  template: `
    <div class="flex-col mb-2">
      <label for="service-form-description">Description</label>
      <textarea
        class="border rounded px-3 py-2 w-full"
        hasError
        invalidTooltip
        placeholder="Write some description of service"
        id="service-form-description"
        [formControl]="control"></textarea>
    </div>
  `
})
export class DescriptionServiceFormComponent {

  @Input()
  public control = new FormControl();


}
