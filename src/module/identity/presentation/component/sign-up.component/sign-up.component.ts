import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {RouterLink} from '@angular/router';
import {EmailComponent} from '@identity/presentation/component/email.component/email.component';
import {PasswordComponent} from '@identity/presentation/component/password.component/password.component';
import RegistrationForm from '@identity/form/registration.form';
import {DisplayNameComponent} from '@identity/presentation/component/display-name.component/display-name.component';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';

@Component({
  selector: 'identity-sign-up-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <form [formGroup]="form">

      <identity-display-name-component
        id="identity-sign_up-form-input-display-name"
        label="identity.sign-up.form.inputs.display-name.label"
        placeholder="identity.sign-up.form.inputs.display-name.placeholder"
        [control]="form.controls.displayName">
      </identity-display-name-component>

      <identity-email-component
        id="identity-sign_up-form-input-email"
        label="identity.sign-up.form.inputs.email.label"
        placeholder="identity.sign-up.form.inputs.email.placeholder"
        [control]="form.controls.email">
      </identity-email-component>

      <identity-password-component
        id="identity-sign_up-form-input-password"
        label="identity.sign-up.form.inputs.password.label"
        placeholder="identity.sign-up.form.inputs.password.placeholder"
        [control]="form.controls.password">
      </identity-password-component>

      <identity-password-component
        id="identity-sign_up-form-input-password-confirm"
        label="identity.sign-up.form.inputs.password-confirm.label"
        placeholder="identity.sign-up.form.inputs.password-confirm.placeholder"
        [control]="form.controls.passwordConfirm">
      </identity-password-component>

      <!--          <div class="form-check">-->
      <!--            <input class="form-check-input" type="checkbox" id="basic-register-checkbox">-->
      <!--            <label-->
      <!--              class="form-label" for="basic-register-checkbox">-->
      <!--              I accept the <a href="#!">terms </a>and <a href="#!">privacy-->
      <!--              policy</a>-->
      <!--            </label>-->
      <!--          </div>-->

      <div class="my-3 d-grid">
        <button
          beeoclock
          (click)="submit()"
          [disabled]="form.pending"
          [showLoader]="form.pending">
          {{ 'identity.sign-up.form.button.submit' | translate }}
        </button>
      </div>
    </form>

  `,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    RouterLink,
    EmailComponent,
    PasswordComponent,
    DisplayNameComponent,
    ButtonComponent,
  ]
})
export class SignUpComponent {

  @Input()
  public form!: RegistrationForm;

  @Output()
  public signUp = new EventEmitter<void>();

  public submit(): void {
    this.signUp.emit();
  }

}
