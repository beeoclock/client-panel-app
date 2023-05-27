import {Component, Input} from '@angular/core';
import {AttendantComponent} from '@event/presentation/component/form/attendant/attendant.component';
import {NgForOf} from '@angular/common';
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
      *ngFor="let control of form.controls; let index = index"
      (removeEvent)="form.remove(index)"
      [showRemoveButton]="index > 0"
      [index]="index"
      [form]="control">
    </event-attendant-component>

    <button (click)="form.pushNewAttendant()" class="w-full border rounded px-4 py-2 hover:bg-neutral-100">
      <i class="bi bi-plus-lg"></i>
      Add attendant
    </button>
  `
})
export class AttendeesComponent {
  @Input()
  public form!: AttendeesForm;

}
