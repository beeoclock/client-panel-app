import {Component, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/presentation/pipes/first-key-name/first-key-name.module';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";

@Component({
  selector: 'identity-reset-password-component',
  encapsulation: ViewEncapsulation.None,
  template: `
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HasErrorDirective,
    NgIf,
    TranslateModule,
    FirstKeyNameModule,
    RouterLink,
    DeleteButtonComponent,
    FormInputComponent
  ]
})
export class ResetPasswordComponent {

}
