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
    <!--    <div class="p-4 p-md-5 flex-grow-1">-->
    <!--      <div class="row flex-between-center">-->
    <!--        <div class="col-auto text-center w-100">-->
    <!--          <h3>{{ 'identity.sign-in.form.label' | translate }}</h3>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <form [formGroup]="form" novalidate>-->

    <!--        <identity-email-component-->
    <!--          id="identity-sign_in-form-input-email"-->
    <!--          label="identity.sign-in.form.inputs.email.label"-->
    <!--          placeholder="identity.sign-in.form.inputs.email.placeholder"-->
    <!--          [control]="form.controls.email">-->
    <!--        </identity-email-component>-->

    <!--        <identity-password-component-->
    <!--          id="identity-sign_in-form-input-password"-->
    <!--          label="identity.sign-in.form.inputs.password.label"-->
    <!--          placeholder="identity.sign-in.form.inputs.password.placeholder"-->
    <!--          [control]="form.controls.password">-->
    <!--        </identity-password-component>-->

    <!--        <div class="row flex-between-center">-->
    <!--          <div class="my-3 d-grid">-->
    <!--            <button-->
    <!--              beeoclock-->
    <!--              (click)="signIn()"-->
    <!--              [disabled]="form.pending"-->
    <!--              [showLoader]="form.pending">-->
    <!--              {{ 'identity.sign-in.form.button.submit' | translate }}-->
    <!--            </button>-->
    <!--          </div>-->
    <!--          <div class="col-auto w-100 text-center">-->
    <!--            <a class="fs&#45;&#45;1" routerLink="forgot-password" translate="identity.sign-in.form.button.forgot-password">-->
    <!--            </a>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </form>-->
    <!--    </div>-->

    <form [formGroup]="form" class="space-y-6" action="#" method="POST">
      <div>
        <label for="email" class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">Email
          address</label>
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
                text-beeColor-900
                dark:text-beeDarkColor-100
                shadow-sm
                dark:bg-beeDarkColor-700
                ring-1
                ring-inset
                ring-beeColor-300
                placeholder:text-beeColor-400
                focus:ring-2
                focus:ring-inset
                focus:ring-stone-800
                sm:text-sm sm:leading-6">
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between">
          <label for="password"
                 class="block text-sm font-medium leading-6 text-beeColor-900 dark:text-white">Password</label>
          <div class="text-sm">
            <a href="#" class="font-semibold text-blue-600 dark:text-black hover:text-blue-500">Forgot
              password?</a>
          </div>
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
                dark:bg-beeDarkColor-700
                py-1.5
                text-beeColor-900
                dark:text-beeDarkColor-100
                shadow-sm
                ring-1
                ring-inset
                ring-beeColor-300
                placeholder:text-beeColor-400
                focus:ring-2
                focus:ring-inset
                focus:ring-stone-800
                sm:text-sm
                sm:leading-6">
        </div>
      </div>

      <div>
        <button
          (click)="signIn()"
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
          Sign in
        </button>
      </div>
    </form>
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
