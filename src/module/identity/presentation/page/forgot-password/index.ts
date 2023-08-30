import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/component/getting-started/getting-started.component';
import ResetPasswordForm from "@identity/presentation/form/reset-password.form";
import {Router} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {ToastController} from "@ionic/angular";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ForgotPasswordApiAdapter} from "@identity/adapter/external/api/forgot-password.api.adapter";

@Component({
  selector: 'identity-forgot-password-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    GettingStartedComponent,
    ReactiveFormsModule,
    FormInputComponent,
    BackLinkComponent,
    TranslateModule,
    CardComponent,
    ChangeLanguageComponent,
    PrimaryButtonDirective
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public readonly form = new ResetPasswordForm();
  private readonly forgotPasswordApiAdapter = inject(ForgotPasswordApiAdapter);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly toastController = inject(ToastController);

  public signIn(): void {

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();

      const {email} = this.form.value;

      if (email) {

        this.forgotPasswordApiAdapter.executeAsync({
          email
        }).then(() => {
          this.toastController.create({
            header: this.translateService.instant('identity.forgot-password.form.label'),
            message: 'Success',
            color: 'success',
            position: 'top',
            duration: 10_000,
            buttons: [
              {
                text: this.translateService.instant('keyword.capitalize.close'),
                role: 'cancel',
              },
            ],
          }).then((toast) => {
            toast.present();
          });
          this.router.navigate(['/', 'identity']);
        }).finally(() => {
          this.form.enable();
          this.form.updateValueAndValidity();
        });

      }

    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
    }

  }

}
