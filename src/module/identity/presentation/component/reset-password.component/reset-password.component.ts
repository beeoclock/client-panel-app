import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {Router, RouterLink} from '@angular/router';
import {EmailComponent} from '@identity/presentation/component/email.component/email.component';
import {PasswordComponent} from '@identity/presentation/component/password.component/password.component';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {Auth, sendPasswordResetEmail} from "@angular/fire/auth";
import {Notification} from "@utility/domain/notification";
import ResetPasswordForm from "@identity/form/reset-password.form";

@Component({
  selector: 'identity-reset-password-component',
  encapsulation: ViewEncapsulation.None,
  template: `

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
          Send
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
export class ResetPasswordComponent {

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public readonly form = new ResetPasswordForm();
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);

  public signIn(): void {

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();

      const {email} = this.form.value;

      if (email) {

        sendPasswordResetEmail(this.auth, email).then(async () => {
          await this.router.navigate(['/', 'identity']);
        });

      }

      // signInWithEmailAndPassword(this.auth, email, password)
      //   .then(async () => {
      //     await firstValueFrom(this.store.dispatch(new IdentityActions.InitToken()));
      //   })
      //   .catch((result: FirebaseError) => {
      //     this.form.enable();
      //     this.form.updateValueAndValidity();
      //     WarningNotification.push({
      //       message: result.message,
      //     });
      //   });

    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
      Notification.push({
        message: 'Form is not valid!'
      });
    }

  }

}
