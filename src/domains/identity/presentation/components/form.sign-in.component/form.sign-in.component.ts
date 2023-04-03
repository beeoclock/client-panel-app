import {Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {TogglePasswordModule} from '@utility/pipes/toggle-password/toggle-password.module';
import {RouterLink} from '@angular/router';
import {EmailSignInComponent} from '@identity/presentation/components/email.sign-in.component/email.sign-in.component';
import {
  PasswordSignInComponent
} from '@identity/presentation/components/password.sign-in.component/password.sign-in.component';
import LoginForm from '@identity/form/login.form';

@Component({
  selector: 'identity-form-sign-in-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="p-4 p-md-5 flex-grow-1">
      <div class="row flex-between-center">
        <div class="col-auto text-center w-100">
          <h3>{{ 'identity.sign-in.form.label' | translate }}</h3>
        </div>
      </div>
      <form (ngSubmit)="submit()" [formGroup]="form" novalidate>

        <identity-email-sign-in-component
          [control]="form.controls.email">
        </identity-email-sign-in-component>

        <identity-password-sign-in-component
          [control]="form.controls.password">
        </identity-password-sign-in-component>

        <div class="row flex-between-center">
          <div class="mb-3">
            <button class="btn btn-primary d-block w-100 mt-3" type="submit">
              {{ 'identity.sign-in.form.button.submit' | translate }}
            </button>
          </div>
          <div class="col-auto w-100 text-center">
            <a class="fs--1" routerLink="forgot-password">
              {{ 'identity.sign-in.form.button.forgot-password' | translate }}
            </a>
          </div>
        </div>
      </form>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorModule,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    TogglePasswordModule,
    RouterLink,
    EmailSignInComponent,
    PasswordSignInComponent
  ]
})
export class FormSignInComponent {

  @Input()
  public form!: LoginForm;

  @Output()
  public signIn = new EventEmitter<void>();

  @HostBinding()
  public class = 'col-md-7 d-flex flex-center';

  public submit(): void {
    this.signIn.emit();
  }

}
