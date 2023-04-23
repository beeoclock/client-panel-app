import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DurationVersionForm} from '@service/form/service.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/directives/input/input.directive';
import {NgForOf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {PricesFormComponent} from '@service/presentation/component/form/prices.form.component';
import {BreakDurationFormComponent} from '@service/presentation/component/form/duration/break.duration.form.component';
import {
  DurationDurationFormComponent
} from '@service/presentation/component/form/duration/duration.duration.form.component';

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
    PricesFormComponent,
    BreakDurationFormComponent,
    DurationDurationFormComponent,
  ],
  template: `
    <form [formGroup]="form">

      <service-break-duration-form-component
        [control]="form.controls.break">
      </service-break-duration-form-component>

      <service-duration-duration-form-component
        [control]="form.controls.duration">
      </service-duration-duration-form-component>

      <service-prices-form-component
        [form]="form.controls.prices">
      </service-prices-form-component>

    </form>
  `
})
export class DurationFormComponent {

  @Input()
  public form = new DurationVersionForm();

}
