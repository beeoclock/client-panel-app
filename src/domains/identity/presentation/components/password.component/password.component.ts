import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {TogglePasswordModule} from '@utility/pipes/toggle-password/toggle-password.module';
import {InputComponent} from '@utility/presentation/components/input/input.component';
import {InputErrorComponent} from '@utility/presentation/components/input-error/input-error.component';

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
          [id]="id"
          [formControl]="control"
          beeoclock
          togglePassword
          hasError
          [inputGroup]="true"
          [checkFormError]="true"
          [name]="'key-fill'"
          [placeholder]="placeholder | translate"
          [class.border-danger]="loginFormHasError && control.root.touched">

      </div>

      <utility-input-error-component [control]="control"></utility-input-error-component>

    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorModule,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    TogglePasswordModule,
    InputComponent,
    InputComponent,
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
