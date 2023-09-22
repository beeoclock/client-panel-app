import {Component, Input, ViewEncapsulation} from '@angular/core';
import {SelectWeekDayComponent} from "@utility/presentation/component/input/select-week-day.component";
import {TimeInputComponent} from "@utility/presentation/component/input/time.input.component";
import {TranslateModule} from "@ngx-translate/core";
import {ScheduleForm} from "@utility/presentation/form/schdeule.form";

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
      <div class="col-span-6">
        <select-week-day-component [control]="form.controls.workDays"/>
      </div>
      <div class="col-span-6 md:col-span-3">
				<time-input-component [control]="form.controls.startInSeconds" [label]="'keyword.capitalize.start' | translate"/>
      </div>
      <div class="col-span-6 md:col-span-3">
				<time-input-component [control]="form.controls.endInSeconds" [label]="'keyword.capitalize.end' | translate"/>
      </div>
    </div>
  `
})
export class ScheduleFormComponent {

  @Input()
  public form = new ScheduleForm();

}
