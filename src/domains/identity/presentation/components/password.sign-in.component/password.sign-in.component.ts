import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {TogglePasswordModule} from '@utility/pipes/toggle-password/toggle-password.module';

@Component({
  selector: 'identity-password-sign-in-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="mb-3 position-relative">
      <label
        translate="identity.sign-in.form.inputs.password.label"
        class="form-label"
        for="identity-sign_in-form-input-password">
      </label>

      <div class="input-group">

        <input
          id="identity-sign_in-form-input-password"
          [formControl]="control"
          class="form-control"
          togglePassword
          hasError
          [inputGroup]="true"
          [checkFormError]="true"
          [name]="'key-fill'"
          [placeholder]="'identity.sign-in.form.inputs.password.placeholder' | translate"
          [class.border-danger]="loginFormHasError && control.root.touched">

      </div>

      <div class="invalid-tooltip" *ngIf="control.errors">
        {{ ('form.validation.' + (control.errors | firstKeyName)) | translate }}
      </div>

    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorModule,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    TogglePasswordModule
  ]
})
export class PasswordSignInComponent {

  @Input()
  public control!: FormControl;

  public get loginFormHasError(): boolean {
    return !!Object.keys(this.control.root?.errors ?? {})?.length;
  }

}
