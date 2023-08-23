import {Component, HostBinding, inject, ViewEncapsulation} from '@angular/core';
import {GettingStartedComponent} from '@utility/presentation/component/getting-started/getting-started.component';
import ResetPasswordForm from "@identity/form/reset-password.form";
import {Router} from "@angular/router";
import {Auth, sendPasswordResetEmail} from "@angular/fire/auth";
import {ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {BackLinkComponent} from "@utility/presentation/component/link/back.link.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {ToastController} from "@ionic/angular";

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
    ChangeLanguageComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public readonly form = new ResetPasswordForm();
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private readonly toastController = inject(ToastController);
  private readonly auth = inject(Auth);

  public signIn(): void {

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.disable();
      this.form.markAsPending();

      const {email} = this.form.value;

      if (email) {

        sendPasswordResetEmail(this.auth, email).then(() => {
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
          }).then((toast)=> {
            toast.present();
          });
          this.router.navigate(['/', 'identity']);
        });

      }

    } else {
      this.form.enable();
      this.form.updateValueAndValidity();
    }

  }

}
