import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import LoginForm from '@identity/form/login.form';
import {FirebaseError} from '@angular/fire/app';
import {SignInComponent} from '@identity/presentation/component/sign-in.component/sign-in.component';
import {Notification, WarningNotification} from '@utility/notification';

@Component({
  selector: 'identity-sign-in-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SignInComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly form = new LoginForm();
  private readonly auth = inject(Auth);

  public signIn(): void {

    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form.markAsPending();

      const {email, password} = this.form.value;
      if (email && password) {

        signInWithEmailAndPassword(this.auth, email, password)
          .then((result) => {

            console.log(result);

            return result;
          })
          .catch((result: FirebaseError) => {
            this.form.updateValueAndValidity();
            WarningNotification.push({
              message: result.message,
            });
          });

      } else {
        this.form.updateValueAndValidity();
        Notification.push({
          message: 'E-mail or password is wrong!'
        });
      }

    } else {
      this.form.updateValueAndValidity();
      Notification.push({
        message: 'Form is not valid!'
      });
    }


  }

}
