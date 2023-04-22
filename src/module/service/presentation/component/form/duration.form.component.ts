import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DurationVersionForm} from '@service/form/service.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {NgForOf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {PricesFormComponent} from '@service/presentation/component/form/prices.form.component';

@Component({
  selector: 'service-duration-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputErrorComponent,
    NgSelectModule,
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    NgForOf,
    PricesFormComponent
  ],
  template: `
    <form [formGroup]="form">

      <div class="col-12 mt-2 position-relative">
        <label for="service-form-break">Break</label>
        <div class="input-group">
          <input
            beeoclock
            type="number"
            hasError
            placeholder="Write title of service"
            id="service-form-break"
            formControlName="break">
          <span class="input-group-text" id="basic-addon2">minute</span>
        </div>
        <utility-input-error-component
          [control]="form.controls.break"></utility-input-error-component>
      </div>

      <div class="col-12 mt-2 position-relative">
        <label for="service-form-duration">Duration</label>
        <div class="input-group">
          <input
            beeoclock
            hasError
            type="number"
            placeholder="Write title of service"
            id="service-form-duration"
            formControlName="duration">
          <span class="input-group-text" id="basic-addon2">minute</span>
        </div>
        <utility-input-error-component
          [control]="form.controls.duration"></utility-input-error-component>
      </div>

      <service-prices-form-component [form]="form.controls.prices">

      </service-prices-form-component>

    </form>
  `
})
export class DurationFormComponent {

  @Input()
  public form: DurationVersionForm = new DurationVersionForm();

}
