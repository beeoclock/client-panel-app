import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {Router, RouterLink} from '@angular/router';
import RegistrationForm from '@identity/form/registration.form';
import {ButtonComponent} from '@utility/presentation/component/button/button.component';
import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {firstValueFrom} from "rxjs";
import {ToastController} from "@ionic/angular";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {IsRequiredDirective} from "@utility/directives/is-required/is-required";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";

@Component({
  selector: 'identity-sign-up-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `

    <form [formGroup]="form" class="gap-4 flex flex-col" action="#" method="POST">

      <form-input
        id="email"
        type="email"
        autocomplete="email"
        placeholder="firstname.lastname@example.com"
        [control]="form.controls.email"
        [label]="'identity.sign-up.form.inputs.email.label' | translate">
      </form-input>

      <form-input-password
        id="password"
        autocomplete="password"
        [control]="form.controls.password"
        placeholder="password"
        [label]="'identity.sign-up.form.inputs.password.label' | translate">
      </form-input-password>

      <form-input-password
        id="passwordConfirm"
        autocomplete="passwordConfirm"
        [control]="form.controls.passwordConfirm"
        placeholder="passwordConfirm"
        [label]="'identity.sign-up.form.inputs.password-confirm.label' | translate">
      </form-input-password>

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
    ButtonComponent,
    InvalidTooltipDirective,
    IsRequiredDirective,
    FormInputComponent,
    FormInputPasswordComponent,
  ]
})
export class SignUpComponent {
  public readonly identityApiAdapter = inject(IdentityApiAdapter);

  public readonly form = new RegistrationForm();
  private readonly toastController = inject(ToastController);
  private readonly router = inject(Router);

  public async signUp(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();
      await firstValueFrom(this.identityApiAdapter.postCreateUser$(this.form.getRawValue())).then(async () => {
        this.form.enable();
        this.form.updateValueAndValidity();
        const toast = await this.toastController.create({
          header: 'Sign up',
          message: 'Success',
          color: 'success',
          position: 'top'
        });
        await toast.present();
        await this.router.navigate(['/', 'identity']);
      });
    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
    }
  }

}
