import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ScheduleForm} from '@service/form/service.form';
import {WEEK, WEEK_DAYS_NAME} from '@utility/domain/enum/days-of-week.enum';
import {FlatpickrModule} from 'angularx-flatpickr';
import {ReactiveFormsModule} from '@angular/forms';

import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
  selector: 'service-schedule-form-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    HasErrorDirective,
    FlatpickrModule,
    ReactiveFormsModule,

    NgSelectModule,
    InvalidTooltipDirective
  ],
  template: `
    <form [formGroup]="form">
      <div class="col-12 mt-2 position-relative">
        <label for="service-form-workDays">Work days</label>
        <ng-select [items]="week"
                   [multiple]="true"
                   id="service-form-workDays"
                   bindLabel="name"
                   bindValue="id"
                   formControlName="workDays">
        </ng-select>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div class="">
          <label for="service-form-startTime">Start</label>
          <input
            hasError
            invalidTooltip
            id="service-form-startTime"
            type="text"
            class="border rounded px-3 py-2 w-full"
            formControlName="startTime"
            [time24hr]="true"
            mwlFlatpickr
            [noCalendar]="true"
            [enableTime]="true"
            [dateFormat]="'H:i'"
          />
        </div>
        <div class="">
          <label for="service-form-endTime">End</label>
          <input
            hasError
            invalidTooltip
            id="service-form-endTime"
            type="text"
            class="border rounded px-3 py-2 w-full"
            formControlName="endTime"
            [time24hr]="true"
            mwlFlatpickr
            [noCalendar]="true"
            [enableTime]="true"
            [dateFormat]="'H:i'"
          />
        </div>
      </div>
    </form>
  `
})
export class ScheduleFormComponent {

  @Input()
  public form: ScheduleForm = new ScheduleForm();

  public readonly week = WEEK.map((day) => ({
    id: day,
    name: WEEK_DAYS_NAME[day]
  }));

}
