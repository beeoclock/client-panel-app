import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {InputDirective} from '@utility/directives/input/input.directive';
import {InputErrorComponent} from '@utility/presentation/component/input-error/input-error.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'identity-password-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="mb-3 position-relative">
      <label
        class="form-label"
        [translate]="label"
        [for]="id">
      </label>

      <div class="input-group">

        <input
          #passwordInput
          [id]="id"
          [formControl]="control"
          class="form-control"
          hasError
          type="password"
          [inputGroup]="true"
          [checkFormError]="true"
          [name]="'key-fill'"
          [placeholder]="placeholder | translate"
          [class.border-danger]="loginFormHasError && control.root.touched">

        <button
          (click)="passwordInput.type = passwordInput.type === 'text' ? 'password' : 'text'"
          class="btn btn-primary">
          <i
            class="bi"
            [class.bi-eye-slash]="passwordInput.type === 'text'"
            [class.bi-eye]="passwordInput.type === 'password'">
          </i>
        </button>

      </div>

      <utility-input-error-component [control]="control"></utility-input-error-component>

    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    InputDirective,
    InputDirective,
    InputErrorComponent
  ]
})
export class PasswordComponent {

  @Input()
  public id!: string;

  @Input()
  public label!: string;

  @Input()
  public placeholder!: string;

  @Input()
  public control!: FormControl;

  public get loginFormHasError(): boolean {
    return !!Object.keys(this.control.root?.errors ?? {})?.length;
  }

}
