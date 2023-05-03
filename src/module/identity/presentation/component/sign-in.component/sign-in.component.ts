import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {RouterLink} from '@angular/router';
import {EmailComponent} from '@identity/presentation/component/email.component/email.component';
import {PasswordComponent} from '@identity/presentation/component/password.component/password.component';
import LoginForm from '@identity/form/login.form';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {FirebaseError} from "@angular/fire/app";
import {Notification, WarningNotification} from "@utility/domain/notification";

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
      <form [formGroup]="form" novalidate>

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
            <button
              beeoclock
              (click)="signIn()"
              [disabled]="form.pending"
              [showLoader]="form.pending">
              {{ 'identity.sign-in.form.button.submit' | translate }}
            </button>
          </div>
          <div class="col-auto w-100 text-center">
            <a class="fs--1" routerLink="forgot-password" translate="identity.sign-in.form.button.forgot-password">
            </a>
          </div>
        </div>
      </form>
    </div>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    RouterLink,
    EmailComponent,
    PasswordComponent,
    ButtonComponent
  ]
})
export class SignInComponent {

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public readonly form = new LoginForm();
  private readonly auth = inject(Auth);

  public signIn(): void {

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();

      const {email, password} = this.form.value;
      if (email && password) {

        signInWithEmailAndPassword(this.auth, email, password)
          .catch((result: FirebaseError) => {
            this.form.enable();
            this.form.updateValueAndValidity();
            WarningNotification.push({
              message: result.message,
            });
          });

      } else {
        this.form.enable();
        this.form.updateValueAndValidity();
        Notification.push({
          message: 'E-mail or password is wrong!'
        });
      }

    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
      Notification.push({
        message: 'Form is not valid!'
      });
    }

  }

}
