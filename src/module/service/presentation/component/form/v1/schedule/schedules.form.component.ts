import {SchedulesForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ScheduleFormComponent} from "@service/presentation/component/form/v1/schedule/schedule.form.component";

@Component({
  selector: 'service-schedules-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent,
    NgIf,
  ],
  template: `
    <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 mt-4">

      <div class="flex flex-col gap-3">
        <div
          *ngFor="let scheduleForm of schedulesForm.controls; let index = index"
          class="border border-beeColor-200 rounded-lg dark:bg-beeDarkColor-700 dark:border-beeDarkColor-600 dark:text-white">
          <div
            class="
          justify-between
          flex
          w-full
          px-4
          py-2
          bg-beeColor-100
          border-b
          border-beeColor-200
          rounded-t-lg
          cursor-pointer
          dark:bg-beeDarkColor-800
          dark:border-beeDarkColor-600">
            Schedule version #{{ index + 1 }}
            <button class="text-red-500" (click)="schedulesForm.remove(index)" *ngIf="index > 0">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="p-4">
            <service-schedule-form-component
              [form]="scheduleForm">
            </service-schedule-form-component>
          </div>
        </div>
      </div>

      <hr class="my-4">

      <button class="border rounded px-4 py-2" (click)="pushNewScheduleForm($event)">
        <i class="bi bi-plus-lg me-2"></i>
        Add new interval
      </button>
    </div>
  `
})
export class SchedulesFormComponent {

  @Input()
  public schedulesForm = new SchedulesForm();

  @Output()
  public readonly handlePushNewScheduleForm: EventEmitter<Event> = new EventEmitter();

  public pushNewScheduleForm($event: Event): void {
    this.handlePushNewScheduleForm.emit($event);
  }

}
