import {Component, inject, ViewEncapsulation} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  UserCredential
} from '@angular/fire/auth';
import {ReactiveFormsModule} from '@angular/forms';
import RegistrationForm from '@identity/form/registration.form';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgIf} from '@angular/common';
import {SignUpComponent} from '@identity/presentation/components/sign-up.component/sign-up.component';

@Component({
  selector: 'identity-sign-up-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    NgIf,
    SignUpComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly form: RegistrationForm = new RegistrationForm();
  private readonly auth: Auth = inject(Auth);

  public signUp(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
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
            console.log('E-mail is sent.');
          })
          .catch((error) => {
            this.form.updateValueAndValidity();
          });
      }
    } else {
      this.form.updateValueAndValidity();
    }
  }

}
