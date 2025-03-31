import {Component, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {DeleteButtonComponent} from '@shared/presentation/component/button/delete.button.component';
import {HasErrorDirective} from '@shared/presentation/directives/has-error/has-error.directive';
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {FirstKeyNamePipe} from "@shared/presentation/pipes/first-key-name/first-key-name.pipe";

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
		FirstKeyNamePipe,
		RouterLink,
		DeleteButtonComponent,
		FormInputComponent
	]
})
export class ResetPasswordComponent {

}
