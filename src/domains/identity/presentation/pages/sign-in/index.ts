import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import LoginForm from '@identity/form/login.form';
import {FirebaseError} from '@angular/fire/app';
import {FormSignInComponent} from '@identity/presentation/components/form.sign-in.component/form.sign-in.component';

@Component({
  selector: 'identity-sign-in-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormSignInComponent
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly form = new LoginForm();
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  public signIn(): void {

    this.form.markAllAsTouched();

    if (this.form.valid) {

      const {email, password} = this.form.value;
      if (email && password) {
        signInWithEmailAndPassword(this.auth, email, password)
          .then((result) => {

            console.log(result);
            this.router.navigate(['/', 'dashboard']);

            return result;
          })
          .catch((result: FirebaseError) => {

          });
      }

    }


  }

}
