import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {utils} from '@src/scripts/utls';
import {wizardInit} from '@src/scripts/wizard';
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

@Component({
  selector: 'identity-registration-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index implements AfterViewInit {

  public readonly form: RegistrationForm = new RegistrationForm();
  private readonly auth: Auth = inject(Auth);

  public ngAfterViewInit(): void {
    utils.docReady(wizardInit);
  }

  public signUp(): void {
    console.log(this.form.value);
    const {email, password, displayName} = this.form.value;
    if (email && password && displayName) {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (userCredential: UserCredential) => {
          console.log(userCredential);
          const {user} = userCredential;
          await sendEmailVerification(user, {
            // url: `${location.origin}/identity/confirm-email` // The url only for redirect from standard verification feature and also you can use the param when create own link to verify e-mail.
            url: location.origin,
          });
          await updateProfile(user, {
            displayName
          });
          console.log('E-mail is sent.')
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

}
