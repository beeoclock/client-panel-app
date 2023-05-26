import {Component, inject, ViewEncapsulation} from '@angular/core';
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
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  UserCredential
} from "@angular/fire/auth";
import {Notification, WarningNotification} from "@utility/domain/notification";

@Component({
  selector: 'identity-sign-up-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
<!--    <form [formGroup]="form">-->

<!--      <identity-display-name-component-->
<!--        id="identity-sign_up-form-input-display-name"-->
<!--        label="identity.sign-up.form.inputs.display-name.label"-->
<!--        placeholder="identity.sign-up.form.inputs.display-name.placeholder"-->
<!--        [control]="form.controls.displayName">-->
<!--      </identity-display-name-component>-->

<!--      <identity-email-component-->
<!--        id="identity-sign_up-form-input-email"-->
<!--        label="identity.sign-up.form.inputs.email.label"-->
<!--        placeholder="identity.sign-up.form.inputs.email.placeholder"-->
<!--        [control]="form.controls.email">-->
<!--      </identity-email-component>-->

<!--      <identity-password-component-->
<!--        id="identity-sign_up-form-input-password"-->
<!--        label="identity.sign-up.form.inputs.password.label"-->
<!--        placeholder="identity.sign-up.form.inputs.password.placeholder"-->
<!--        [control]="form.controls.password">-->
<!--      </identity-password-component>-->

<!--      <identity-password-component-->
<!--        id="identity-sign_up-form-input-password-confirm"-->
<!--        label="identity.sign-up.form.inputs.password-confirm.label"-->
<!--        placeholder="identity.sign-up.form.inputs.password-confirm.placeholder"-->
<!--        [control]="form.controls.passwordConfirm">-->
<!--      </identity-password-component>-->

<!--      <div class="form-check">-->
<!--        <input class="form-check-input" type="checkbox" id="basic-register-checkbox">-->
<!--        <label-->
<!--          class="form-label" for="basic-register-checkbox">-->
<!--          I accept the <a href="#!">terms </a>and <a href="#!">privacy-->
<!--          policy</a>-->
<!--        </label>-->
<!--      </div>-->

<!--      <div class="my-3 d-grid">-->
<!--        <button-->
<!--          beeoclock-->
<!--          (click)="signUp()"-->
<!--          [disabled]="form.pending"-->
<!--          [showLoader]="form.pending">-->
<!--          {{ 'identity.sign-up.form.button.submit' | translate }}-->
<!--        </button>-->
<!--      </div>-->
<!--    </form>-->



    <form [formGroup]="form" class="space-y-6" action="#" method="POST">
      <div>
        <label for="displayName" class="block text-sm font-medium leading-6 text-neutral-900 dark:text-white">
          {{ 'identity.sign-up.form.inputs.display-name.label' | translate }}
        </label>
        <div class="mt-2">
          <input
            required
            id="displayName"
            name="displayName"
            type="text"
            formControlName="displayName"
            autocomplete="displayName"
            class="
                px-3
                block
                w-full
                rounded-md
                border-0
                py-1.5
                text-neutral-900
                dark:text-neutral-100
                shadow-sm
                dark:bg-neutral-700
                ring-1
                ring-inset
                ring-neutral-300
                placeholder:text-neutral-400
                focus:ring-2
                focus:ring-inset
                focus:ring-stone-800
                sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-neutral-900 dark:text-white">
          {{ 'identity.sign-up.form.inputs.email.label' | translate }}
        </label>
        <div class="mt-2">
          <input
            required
            id="email"
            name="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="
                px-3
                block
                w-full
                rounded-md
                border-0
                py-1.5
                text-neutral-900
                dark:text-neutral-100
                shadow-sm
                dark:bg-neutral-700
                ring-1
                ring-inset
                ring-neutral-300
                placeholder:text-neutral-400
                focus:ring-2
                focus:ring-inset
                focus:ring-stone-800
                sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password"
                 class="block text-sm font-medium leading-6 text-neutral-900 dark:text-white">Password</label>
        </div>
        <div class="mt-2">
          <input
            required
            id="password"
            name="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
            class="
                px-3
                block
                w-full
                rounded-md
                border-0
                dark:bg-neutral-700
                py-1.5
                text-neutral-900
                dark:text-neutral-100
                shadow-sm
                ring-1
                ring-inset
                ring-neutral-300
                placeholder:text-neutral-400
                focus:ring-2
                focus:ring-inset
                focus:ring-stone-800
                sm:text-sm
                sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password"
                 class="block text-sm font-medium leading-6 text-neutral-900 dark:text-white">
            Password confirm
          </label>
        </div>
        <div class="mt-2">
          <input
            required
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            formControlName="passwordConfirm"
            autocomplete="current-passwordConfirm"
            class="
                px-3
                block
                w-full
                rounded-md
                border-0
                dark:bg-neutral-700
                py-1.5
                text-neutral-900
                dark:text-neutral-100
                shadow-sm
                ring-1
                ring-inset
                ring-neutral-300
                placeholder:text-neutral-400
                focus:ring-2
                focus:ring-inset
                focus:ring-stone-800
                sm:text-sm
                sm:leading-6">
        </div>
      </div>

      <div>
        <button
          (click)="signUp()"
          type="submit"
          class="
            flex
            w-full
            justify-center
            rounded-md
            bg-blue-600
            dark:bg-black
            px-3
            py-1.5
            text-sm
            font-semibold
            leading-6
            text-white
            shadow-sm
            hover:bg-blue-500
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-blue-600">
          Sign up
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

  public readonly form = new RegistrationForm();
  private readonly auth = inject(Auth);

  public signUp(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      const {email, password, displayName} = this.form.value;
      if (email && password && displayName) {
        createUserWithEmailAndPassword(this.auth, email, password)
          .then(async (userCredential: UserCredential) => {
            const {user} = userCredential;
            await sendEmailVerification(user, {
              // url: `${location.origin}/identity/confirm-email` // The url only for redirect from standard verification feature and also you can use the param when create own link to verify e-mail.
              url: location.origin,
            });
            await updateProfile(user, {
              displayName
            });
            Notification.push({
              message: 'E-mail is sent.',
            });
          })
          .catch((error) => {
            this.form.enable();
            this.form.updateValueAndValidity();
            WarningNotification.push({
              message: error,
            });
          });
      } else {
        this.form.enable();
        this.form.updateValueAndValidity();
        WarningNotification.push({
          message: 'Form is not valid',
        });
      }
    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
      WarningNotification.push({
        message: 'Form is not valid',
      });
    }
  }

}
