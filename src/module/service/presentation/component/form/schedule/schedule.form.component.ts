import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ScheduleForm} from '@service/form/service.form';
import {WEEK, WEEK_DAYS_NAME} from '@utility/domain/enum/days-of-week.enum';
import {FlatpickrModule} from 'angularx-flatpickr';
import {ReactiveFormsModule} from '@angular/forms';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'service-schedule-form-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    HasErrorDirective,
    FlatpickrModule,
    ReactiveFormsModule,
    InputErrorComponent,
    NgSelectModule
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
        <utility-input-error-component [control]="form.controls.workDays"></utility-input-error-component>
      </div>
      <div class="col-12 mt-2">
        <div class="row">
          <div class="col-md-6 position-relative">
            <label for="service-form-startTime">Start</label>
            <input
              hasError
              id="service-form-startTime"
              type="text"
              class="form-control"
              formControlName="startTime"
              [time24hr]="true"
              mwlFlatpickr
              [noCalendar]="true"
              [enableTime]="true"
              [dateFormat]="'H:i'"
            />
            <utility-input-error-component [control]="form.controls.startTime"></utility-input-error-component>
          </div>
          <div class="col-md-6 position-relative">
            <label for="service-form-endTime">End</label>
            <input
              hasError
              id="service-form-endTime"
              type="text"
              class="form-control"
              formControlName="endTime"
              [time24hr]="true"
              mwlFlatpickr
              [noCalendar]="true"
              [enableTime]="true"
              [dateFormat]="'H:i'"
            />
            <utility-input-error-component [control]="form.controls.endTime"></utility-input-error-component>
          </div>
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
