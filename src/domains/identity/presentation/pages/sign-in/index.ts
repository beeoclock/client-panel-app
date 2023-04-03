import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import LoginForm from '@identity/form/login.form';
import {TranslateModule} from '@ngx-translate/core';
import {Utility} from '@utility/index';
import {NgIf} from '@angular/common';
import {FirebaseError} from '@angular/fire/app';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';

@Component({
  selector: 'identity-sign-in-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    NgIf,
    HasErrorModule,
    FirstKeyNameModule
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index {

  public readonly form = new LoginForm();
  public readonly passwordToggle = new Utility.BooleanStateModel(false);
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
