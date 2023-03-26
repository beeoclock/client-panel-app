import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import LoginForm from '@identity/form/login.form';

@Component({
  selector: 'identity-login-page',
  templateUrl: 'index.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

  public readonly form: LoginForm = new LoginForm();
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);

  public ngOnInit(): void {

    this.auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
      }

    });


    console.log(this.auth.languageCode);
    this.auth.useDeviceLanguage();
    console.log(this.auth.languageCode);
    console.log(this.auth.app);
    console.log(this.auth.emulatorConfig);
    console.log(this.auth.settings);
    console.log(this.auth.tenantId);
  }

  public signIn(): void {

    console.log(this.form.value);
    console.log(this.auth.config);

    const {email, password} = this.form.value;
    if (email && password) {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((result) => {

          console.log(result);
          this.router.navigate(['/', 'dashboard']);

          return result;
        })
        .catch((result) => {
          console.log(result);
        });
    }


  }

}
