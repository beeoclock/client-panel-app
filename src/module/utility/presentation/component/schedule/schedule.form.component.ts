import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ScheduleForm} from "@utility/form/schdeule.form";
import {SelectWeekDayComponent} from "@utility/presentation/component/input/select-week-day.component";
import {TimeInputComponent} from "@utility/presentation/component/input/time.input.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'schedule-form-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SelectWeekDayComponent,
    TimeInputComponent,
    TranslateModule,
  ],
  template: `
    <div class="grid grid-cols-6 gap-2 mt-2">
      <div class="col-span-6 md:col-span-4">
        <select-week-day-component [control]="form.controls.workDays"></select-week-day-component>
      </div>
      <div class="col-span-6 md:col-span-2 flex gap-2">
        <div class="flex flex-col">
          <time-input-component [control]="form.controls.startTime" [label]="'keyword.capitalize.start' | translate">
          </time-input-component>
        </div>
        <div class="flex flex-col">
          <time-input-component [control]="form.controls.endTime" [label]="'keyword.capitalize.end' | translate">
          </time-input-component>
        </div>
      </div>
    </div>
  `
})
export class ScheduleFormComponent {

  @Input()
  public form = new ScheduleForm();

}
