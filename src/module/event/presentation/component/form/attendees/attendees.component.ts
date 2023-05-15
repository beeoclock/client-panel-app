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

    <div class="d-grid">
      <button (click)="form.pushNewAttendant()" class="btn btn-primary mt-2">
        <i class="bi bi-plus-lg"></i>
        Add attendant
      </button>
    </div>
  `
})
export class AttendeesComponent {
  @Input()
  public form!: AttendeesForm;

}
