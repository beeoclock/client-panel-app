import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AttendantForm} from '@event/form/event.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'event-attendant-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    NgIf
  ],
  template: `
    <form [formGroup]="form">
      <label>E-mail</label>
      <div class="input-group mb-3">
        <input
          formControlName="email"
          type="email"
          class="form-control"
          placeholder="E-mail"
          aria-label="E-mail"
          aria-describedby="button-addon2">
        <button
          *ngIf="showRemoveButton"
          (click)="removeEvent.emit()"
          class="btn btn-danger"
          type="button"
          id="button-addon2">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      <utility-input-error-component [control]="form.controls.email"></utility-input-error-component>
    </form>
  `
})
export class AttendantComponent {

  @Input()
  public form!: AttendantForm;

  @Input()
  public showRemoveButton = false;

  @Output()
  public removeEvent: EventEmitter<void> = new EventEmitter<void>();

}
