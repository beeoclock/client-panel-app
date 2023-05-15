import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AttendantForm} from '@event/form/event.form';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {NgIf} from '@angular/common';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IsRequiredDirective} from '@utility/directives/is-required/is-required';

@Component({
  selector: 'event-attendant-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    NgIf,
    HasErrorDirective,
    IsRequiredDirective
  ],
  template: `
    <form [formGroup]="form">
      <label class="form-label" [for]="prefix + index">E-mail</label>
      <div class="input-group mb-3">
        <input
          [id]="prefix + index"
          hasError
          isRequired
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

  @Input()
  public index = 0;

  @Output()
  public removeEvent: EventEmitter<void> = new EventEmitter<void>();

  public readonly prefix = 'event-attendant-component-';

}
