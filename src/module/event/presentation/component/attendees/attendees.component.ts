import {Component, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/attendant/attendant.component';
import {NgForOf} from '@angular/common';
import {FormArray} from '@angular/forms';
import {AttendeesForm} from '@event/form/event.form';

@Component({
  selector: 'event-attendees-component',
  standalone: true,
  imports: [
    AttendeesComponent,
    AttendantComponent,
    NgForOf
  ],
  template: `
    <event-attendant-component
      *ngFor="let attendantFormControl of attendeesFormArray.controls"
      [attendantFormGroup]="attendantFormControl">
    </event-attendant-component>
  `
})
export class AttendeesComponent {
  @Input()
  public attendeesFormArray!: FormArray<AttendeesForm>;

}
