import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/presentation/pipes/first-key-name/first-key-name.module';
import {Router, RouterLink} from '@angular/router';
import LoginForm from '@identity/presentation/form/login.form';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {Store} from "@ngxs/store";
import {IdentityActions} from "@identity/state/identity/identity.actions";
import {firstValueFrom} from "rxjs";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'identity-sign-in-component',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `

    <form [formGroup]="form" class="flex flex-col gap-4" action="#" method="POST">

      <form-input
        id="email"
        type="email"
        autocomplete="email"
        placeholder="firstname.lastname@example.com"
        [control]="form.controls.email"
        [label]="'identity.sign-in.form.inputs.email.label' | translate"/>

      <form-input-password
        id="password"
        autocomplete="password"
        [control]="form.controls.password"
        placeholder="password"
        [label]="'identity.sign-in.form.inputs.password.label' | translate">
        <a label-end routerLink="/identity/forgot-password"
           class="font-semibold text-blue-600 dark:text-black hover:text-blue-500">
          {{ 'identity.sign-in.link.forgotPassword' | translate }}
        </a>
      </form-input-password>

      <div>
        <button type="button" (click)="signIn()" type="submit" primary [isLoading]="form.pending">
          {{ 'keyword.capitalize.signIn' | translate }}
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
    FormInputPasswordComponent,
    PrimaryButtonDirective
  ]
})
export class SignInComponent {

  public readonly form = new LoginForm();
  private readonly router = inject(Router);
  private readonly auth = inject(Auth);
  private readonly toastController = inject(ToastController);
  private readonly translateService = inject(TranslateService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
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

          const toast = await this.toastController.create({
            header: 'Error',
            message: 'Check your credentials',
            color: 'danger',
            position: 'top',
            duration: 10_000,
            buttons: [
              {
                text: this.translateService.instant('keyword.capitalize.close'),
                role: 'cancel',
              },
            ],
          });
          await toast.present();

        }

      }

    }

    this.enableAndUpdateForm();

  }

  private enableAndUpdateForm(): void {
    this.form.enable();
    this.form.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

}
