import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/pipes/first-key-name/first-key-name.module';
import {InputDirective} from '@utility/directives/input/input.directive';

import {HasErrorDirective} from '@utility/directives/has-error/has-error.directive';
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";

// TODO change on tailwind
@Component({
  selector: 'identity-password-component',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  template: `
    <div class="mb-3 position-relative">
      <label
        class="form-label"
        [translate]="label"
        [for]="id">
      </label>

      <div class="input-group">

        <input
          #passwordInput
          [id]="id"
          [formControl]="control"
          class="form-control"
          hasError
          invalidTooltip
          type="password"
          [checkFormError]="true"
          [name]="'key-fill'"
          [placeholder]="placeholder | translate"
          [class.border-danger]="loginFormHasError && control.root.touched">

        <button
          (click)="passwordInput.type = passwordInput.type === 'text' ? 'password' : 'text'"
          class="btn btn-primary">
          <i
            class="bi"
            [class.bi-eye-slash]="passwordInput.type === 'text'"
            [class.bi-eye]="passwordInput.type === 'password'">
          </i>
        </button>

      </div>


    </div>
  `,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    InputDirective,
    InputDirective,
    InvalidTooltipDirective,
  ]
})
export class PasswordComponent {

  @Input()
  public id!: string;

  @Input()
  public label!: string;

  @Input()
  public placeholder!: string;

  @Input()
  public control!: FormControl;

  public get loginFormHasError(): boolean {
    return !!Object.keys(this.control.root?.errors ?? {})?.length;
  }

}
