import {Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {TogglePasswordModule} from '@utility/pipes/toggle-password/toggle-password.module';
import {RouterLink} from '@angular/router';
import {EmailComponent} from '@identity/presentation/components/email.component/email.component';
import {PasswordComponent} from '@identity/presentation/components/password.component/password.component';
import LoginForm from '@identity/form/login.form';
import {ButtonComponent} from '@utility/presentation/components/button/button.component';
import {PrimaryButtonComponent} from '@utility/presentation/components/button/primary.button.component';

@Component({
  selector: 'identity-sign-in-component',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="p-4 p-md-5 flex-grow-1">
      <div class="row flex-between-center">
        <div class="col-auto text-center w-100">
          <h3>{{ 'identity.sign-in.form.label' | translate }}</h3>
        </div>
      </div>
      <form (ngSubmit)="submit()" [formGroup]="form" novalidate>

        <identity-email-component
          id="identity-sign_in-form-input-email"
          label="identity.sign-in.form.inputs.email.label"
          placeholder="identity.sign-in.form.inputs.email.placeholder"
          [control]="form.controls.email">
        </identity-email-component>

        <identity-password-component
          id="identity-sign_in-form-input-password"
          label="identity.sign-in.form.inputs.password.label"
          placeholder="identity.sign-in.form.inputs.password.placeholder"
          [control]="form.controls.password">
        </identity-password-component>

        <div class="row flex-between-center">
          <div class="my-3 d-grid">
            <button beeoclock-primary-button translate="identity.sign-in.form.button.submit"></button>
          </div>
          <div class="col-auto w-100 text-center">
            <a class="fs--1" routerLink="forgot-password">
              {{ 'identity.sign-in.form.button.forgot-password' | translate }}
            </a>
          </div>
        </div>
      </form>
    </div>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HasErrorModule,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    TogglePasswordModule,
    RouterLink,
    EmailComponent,
    PasswordComponent,
    ButtonComponent,
    PrimaryButtonComponent
  ]
})
export class SignInComponent {

  @Input()
  public form!: LoginForm;

  @Output()
  public signIn = new EventEmitter<void>();

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public submit(): void {
    this.signIn.emit();
  }

}
