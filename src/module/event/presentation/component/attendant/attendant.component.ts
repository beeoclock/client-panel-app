import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IAttendeesCreateForm} from '@event/form/event.form';

@Component({
  selector: 'event-attendant-component',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <form [formGroup]="attendantFormGroup">
      <label>E-mail</label>
      <input class="form-control" formControlName="email" type="email">
      <!--          TODO-->
    </form>
  `
})
export class AttendantComponent {

  @Input()
  public attendantFormGroup!: FormGroup<IAttendeesCreateForm>;

}
