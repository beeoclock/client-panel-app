import {Component, Input, ViewEncapsulation} from '@angular/core';

import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'service-break-duration-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [

    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    InvalidTooltipDirective
  ],
  template: `

    <div class="col-12 mt-2 position-relative">
      <label for="service-form-break">Break</label>
      <div class="input-group">
        <input
          invalidTooltip
          type="number"
          hasError
          placeholder="Write title of service"
          id="service-form-break"
          [formControl]="control">
        <span class="input-group-text" id="basic-addon2">minute</span>
      </div>
    </div>
  `
})
export class BreakDurationFormComponent {

  @Input()
  public control = new FormControl();

}