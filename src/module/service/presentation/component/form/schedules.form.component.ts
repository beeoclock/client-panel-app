import {FormArray} from '@angular/forms';
import {ScheduleForm} from '@service/form/service.form';
import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ScheduleFormComponent} from '@service/presentation/component/form/schedule.form.component';

@Component({
  selector: 'service-schedules-form-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgForOf,
    ScheduleFormComponent
  ],
  template: `
    <strong>
      When are you available for the service:
    </strong>
    <service-schedule-form-component
      *ngFor="let scheduleForm of schedulesForm.controls"
      [form]="scheduleForm">
    </service-schedule-form-component>
    <hr>
    <button class="btn btn-primary" (click)="pushNewScheduleForm($event)">Add new interval</button>
  `
})
export class SchedulesFormComponent {

  @Input()
  public schedulesForm: FormArray<ScheduleForm> = new FormArray([new ScheduleForm()]);

  @Output()
  public readonly handlePushNewScheduleForm: EventEmitter<Event> = new EventEmitter();

  public pushNewScheduleForm($event: Event): void {
    this.handlePushNewScheduleForm.emit($event);
  }

}
