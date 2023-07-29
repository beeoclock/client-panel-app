import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";
import {IService} from "@service/domain";
import {TranslateModule} from "@ngx-translate/core";
import {SelectCalendarComponent} from "@event/presentation/component/form/select-time-slot/select-calendar.component";
import {SelectDateComponent} from "@event/presentation/component/form/select-time-slot/select-date.component";
import {SelectTimeComponent} from "@event/presentation/component/form/select-time-slot/select-time.component";

@Component({
  selector: 'event-select-time-slot-form-component',
  standalone: true,
  imports: [
    TranslateModule,
    SelectCalendarComponent,
    SelectDateComponent,
    SelectTimeComponent
  ],
  template: `

    <div class="flex flex-col gap-4">

      <strong class="text-2xl">{{ 'general.dateAndTime' | translate }}</strong>

      <event-select-time-slot-calendar-form-component></event-select-time-slot-calendar-form-component>

      <event-select-time-slot-date-form-component></event-select-time-slot-date-form-component>

      <event-select-time-slot-time-form-component></event-select-time-slot-time-form-component>

    </div>

  `
})
export class SelectTimeSlotComponent {

  @Input()
  public control!: FormControl<IService[]>;

}
