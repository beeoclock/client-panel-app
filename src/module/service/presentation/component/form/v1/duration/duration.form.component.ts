import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DurationVersionForm} from '@service/presentation/form/service.form';

import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {InputDirective} from '@utility/presentation/directives/input/input.directive';
import {NgForOf} from '@angular/common';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {
  BreakDurationFormComponent
} from '@service/presentation/component/form/v1/duration/break.duration.form.component';
import {
  DurationDurationFormComponent
} from '@service/presentation/component/form/v1/duration/duration.duration.form.component';
import {PricesFormComponent} from "@service/presentation/component/form/v1/price/prices.form.component";
import {FormInputComponent} from "@utility/presentation/component/input/form-mask-input.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'service-duration-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [

    NgSelectModule,
    ReactiveFormsModule,
    InputDirective,
    HasErrorDirective,
    NgForOf,
    PricesFormComponent,
    BreakDurationFormComponent,
    DurationDurationFormComponent,
    FormInputComponent,
    TranslateModule,
  ],
  template: `
    <form [formGroup]="form" class="flex flex-col gap-3">

      <form-mask-input
        mask="00:00:00"
        [label]="'general.break' | translate"
        [control]="form.controls.break">
      </form-mask-input>

      <form-mask-input
        mask="00:00:00"
        [label]="'keyword.capitalize.duration' | translate"
        [control]="form.controls.duration">
      </form-mask-input>

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
