import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ScheduleForm} from '@service/form/service.form';
import {WEEK, WEEK_DAYS_NAME} from '@utility/domain/enum/days-of-week.enum';
import {ReactiveFormsModule} from '@angular/forms';

import {NgSelectModule} from '@ng-select/ng-select';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'service-schedule-form-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    HasErrorDirective,
    ReactiveFormsModule,
    NgSelectModule,
    InvalidTooltipDirective,
    IonicModule
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
          <ion-datetime-button datetime="service-form-startTime"></ion-datetime-button>

          <ion-modal [keepContentsMounted]="true">
            <ng-template>
              <ion-datetime presentation="time" formControlName="startTime" id="service-form-startTime"></ion-datetime>
            </ng-template>
          </ion-modal>
        </div>
        <div class="">
          <label for="service-form-endTime">End</label>
          <ion-datetime-button datetime="service-form-endTime"></ion-datetime-button>

          <ion-modal [keepContentsMounted]="true">
            <ng-template>
              <ion-datetime presentation="time" formControlName="endTime" id="service-form-endTime"></ion-datetime>
            </ng-template>
          </ion-modal>
        </div>
      </div>
    </form>
  `
})
export class ScheduleFormComponent {

  @Input()
  public form = new ScheduleForm();

  public readonly week = WEEK.map((day) => ({
    id: day,
    name: WEEK_DAYS_NAME[day]
  }));

}
