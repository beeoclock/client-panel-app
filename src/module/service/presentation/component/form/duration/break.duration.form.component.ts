import {Component, Input, ViewEncapsulation} from '@angular/core';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'service-break-duration-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputErrorComponent,
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective
  ],
  template: `

    <div class="col-12 mt-2 position-relative">
      <label for="service-form-break">Break</label>
      <div class="input-group">
        <input
          beeoclock
          type="number"
          hasError
          placeholder="Write title of service"
          id="service-form-break"
          [formControl]="control">
        <span class="input-group-text" id="basic-addon2">minute</span>
      </div>
      <utility-input-error-component
        [control]="control"></utility-input-error-component>
    </div>
  `
})
export class BreakDurationFormComponent {

  @Input()
  public control = new FormControl();

}
