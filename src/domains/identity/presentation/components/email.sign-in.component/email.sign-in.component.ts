import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {HasErrorModule} from '@utility/directives/has-error/has-error.module';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';

@Component({
  selector: 'identity-email-sign-in-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="mb-3 position-relative">
      <label
        translate="identity.sign-in.form.inputs.email.label"
        class="form-label"
        for="identity-sign_in-form-input-email"></label>
      <div class="input-group">

        <input [checkFormError]="true"
               [inputGroup]="true"
               [name]="'person-fill'"
               [placeholder]="'identity.sign-in.form.inputs.email.placeholder' | translate"
               [formControl]="control"
               hasError
               class="form-control"
               id="identity-sign_in-form-input-email"
               type="email">

      </div>
      <div *ngIf="control.errors" class="invalid-tooltip">
        {{ 'form.validation.' + (control.errors | firstKeyName) | translate }}
      </div>

    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorModule,
    NgIf,
    TranslateModule,
    FirstKeyNameModule
  ]
})
export class EmailSignInComponent {

  @Input()
  public control!: FormControl;

}
