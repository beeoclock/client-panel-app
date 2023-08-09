import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {Router, RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {Auth, sendPasswordResetEmail} from "@angular/fire/auth";
import ResetPasswordForm from "@identity/form/reset-password.form";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";

@Component({
  selector: 'identity-reset-password-component',
  encapsulation: ViewEncapsulation.None,
  template: `
    <form [formGroup]="form" class="space-y-6" action="#" method="POST">

      <form-input
        id="email"
        type="email"
        autocomplete="email"
        placeholder="firstname.lastname@example.com"
        [control]="form.controls.email"
        [label]="'keyword.capitalize.email' | translate">
      </form-input>

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
    DeleteButtonComponent,
    FormInputComponent
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
      //   });

    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
    }

  }

}
