import {SchedulesForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ScheduleFormComponent} from "@service/presentation/component/form/schedule/schedule.form.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {HeaderCardComponent} from "@utility/presentation/component/card/header.card.component";
import {BodyCardComponent} from "@utility/presentation/component/card/body.card.component";
import {FooterCardComponent} from "@utility/presentation/component/card/footer.card.component";

@Component({
  selector: 'service-schedules-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent,
    CardComponent,
    HeaderCardComponent,
    BodyCardComponent,
    FooterCardComponent,
    NgIf,
  ],
  template: `
    Schedules versions section

    <div
      *ngFor="let scheduleForm of schedulesForm.controls; let index = index"
      class="border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-4">
      <div
        class="
          justify-between
          flex
          w-full
          px-4
          py-2
          bg-neutral-100
          border-b
          border-gray-200
          rounded-t-lg
          cursor-pointer
          dark:bg-gray-800
          dark:border-gray-600">
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

    <hr class="my-4">

    <button class="border rounded px-4 py-2" (click)="pushNewScheduleForm($event)">
      <i class="bi bi-plus-lg me-2"></i>
      Add new interval
    </button>
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
