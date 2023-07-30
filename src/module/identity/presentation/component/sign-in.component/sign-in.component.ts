import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {Router, RouterLink} from '@angular/router';
import LoginForm from '@identity/form/login.form';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {Store} from "@ngxs/store";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {firstValueFrom} from "rxjs";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";

@Component({
  selector: 'identity-sign-in-component',
  encapsulation: ViewEncapsulation.None,
  template: `

    <form [formGroup]="form" class="flex flex-col gap-4" action="#" method="POST">

      <form-input
        id="email"
        type="email"
        autocomplete="email"
        placeholder="firstname.lastname@example.com"
        [control]="form.controls.email"
        [label]="'identity.sign-in.form.inputs.email.label' | translate">
      </form-input>

      <form-input-password
        id="password"
        autocomplete="password"
        [control]="form.controls.password"
        placeholder="password"
        [label]="'identity.sign-in.form.inputs.password.label' | translate">
        <a label-end routerLink="/identity/reset-password"
           class="font-semibold text-blue-600 dark:text-black hover:text-blue-500">
          Forgot password?
        </a>
      </form-input-password>

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
    DeleteButtonComponent,
    FormInputComponent,
    FormInputPasswordComponent
  ]
})
export class SignInComponent {

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public readonly form = new LoginForm();
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly store = inject(Store);

  public async signIn(): Promise<void> {

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();

      const {email, password} = this.form.value;
      if (email && password) {

        try {

          const {user} = await signInWithEmailAndPassword(this.auth, email, password);
          const token = await user.getIdTokenResult();
          await firstValueFrom(this.store.dispatch(new IdentityActions.Token(token)));
          await this.router.navigate(['/', 'identity', 'corridor']);

        } catch (error) {
          this.enableAndUpdateForm();
        }

      } else {
        this.enableAndUpdateForm();
      }

    } else {
      this.enableAndUpdateForm();
    }

  }

  private enableAndUpdateForm(): void {
    this.form.enable();
    this.form.updateValueAndValidity();
  }

}
