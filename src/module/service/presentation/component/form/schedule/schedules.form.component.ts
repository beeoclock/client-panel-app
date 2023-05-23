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
    <utility-card-component class="mt-3">
      <utility-header-card-component class="border-bottom">
        When are you available for the service
      </utility-header-card-component>
      <utility-body-card-component>

        <ul class="list-group mt-3"
            *ngFor="let scheduleForm of schedulesForm.controls; let index = index">
          <li class="list-group-item list-group-item-secondary border d-flex justify-content-between">
            <strong>Schedule version #{{ index + 1 }}</strong>
            <button class="btn btn-link text-danger py-0" (click)="schedulesForm.remove(index)" *ngIf="index > 0">
              <i class="bi bi-trash"></i>
            </button>
          </li>
          <li class="list-group-item pb-3">
            <service-schedule-form-component
              [form]="scheduleForm">
            </service-schedule-form-component>
          </li>
        </ul>

      </utility-body-card-component>
      <utility-footer-card-component class="border-top">
        <button class="btn btn-primary" (click)="pushNewScheduleForm($event)">Add new interval</button>
      </utility-footer-card-component>
    </utility-card-component>
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
