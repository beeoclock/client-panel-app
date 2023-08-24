import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ScheduleFormComponent} from "@utility/presentation/component/schedule/schedule.form.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SchedulesForm} from "@utility/presentation/form/schdeule.form";

@Component({
  selector: 'schedules-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    NgIf,
    ScheduleFormComponent,
    CardComponent,
    TranslateModule,
  ],
  template: `
    <card>

      <strong class="dark:text-white">
        {{ 'keyword.capitalize.workingHours' | translate }}
      </strong>

      <div class="flex flex-col gap-8">
        <div
          *ngFor="let scheduleForm of schedulesForm.controls; let index = index"
          class="grid grid-cols-12 gap-2">

          <div class="col-span-11">
            <schedule-form-component
              [form]="scheduleForm">
            </schedule-form-component>
          </div>
          <div class="col-span-1 flex items-center">
            <button class="text-beeColor-600 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-full mt-8"
                    (click)="schedulesForm.remove(index)">
              <i class="bi bi-trash"></i>
            </button>
          </div>

        </div>
      </div>

      <button class="border rounded px-4 py-2" (click)="pushNewScheduleForm($event)">
        <i class="bi bi-plus-lg me-2"></i>
        {{ 'keyword.capitalize.addAvailableHours' | translate }}
      </button>
    </card>
  `
})
export class SchedulesFormComponent {

  @Input()
  public schedulesForm = new SchedulesForm();

  public pushNewScheduleForm($event: Event): void {
    this.schedulesForm.pushNewOne();
  }

}
