import {Component, inject, ViewEncapsulation} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FirstKeyNameModule} from '@utility/presentation/pipes/first-key-name/first-key-name.module';
import {Router, RouterLink} from '@angular/router';
import RegistrationForm from '@identity/presentation/form/registration.form';
import {DeleteButtonComponent} from '@utility/presentation/component/button/delete.button.component';
import {HasErrorDirective} from '@utility/presentation/directives/has-error/has-error.directive';
import {IdentityApiAdapter} from "@identity/adapter/external/api/identity.api.adapter";
import {firstValueFrom} from "rxjs";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {BooleanState} from "@utility/domain";
import {AlreadySignUpLinkComponent} from "@identity/presentation/component/link/alredy-sign-up.link.component";
import {PrimaryLinkStyleDirective} from "@utility/presentation/directives/link/primary.link.style.directive";

@Component({
	selector: 'identity-sign-up-component',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	template: `

		<ng-template [ngIf]="signUpAfterSuccess.isOn">

			<div class="flex flex-col gap-4 items-center justify-center text-center">
				<div class="text-green-500 text-4xl">
					<i class="bi bi-check-circle"></i>
				</div>

				<div class="">
					{{ 'identity.sign-up.afterSuccess.youHaveSuccessfullyRegistered' | translate }}
				</div>

				<div class="">
					{{ 'identity.sign-up.afterSuccess.nextStep' | translate }}
				</div>

				<div class="">
					{{ 'identity.sign-up.afterSuccess.weSentEmail' | translate }} <strong>{{ form.controls.email.value }}</strong>.
				</div>

				<a [href]="emailUrl.href" primaryLinkStyle class="justify-center">
					{{ 'identity.sign-up.afterSuccess.openMailService' | translate }}&nbsp;<strong>{{ emailUrl.host }}</strong>&nbsp;<i class="bi bi-arrow-right"></i>
				</a>
			</div>

		</ng-template>

		<form *ngIf="signUpAfterSuccess.isOff" [formGroup]="form" class="gap-4 flex flex-col" action="#" method="POST">

			<form-input
				id="email"
				inputType="email"
				autocomplete="email"
				[placeholder]="'identity.sign-up.form.inputs.email.placeholder' | translate"
				[control]="form.controls.email"
				[label]="'identity.sign-up.form.inputs.email.label' | translate"/>

			<form-input-password
				id="password"
				autocomplete="password"
				[placeholder]="'identity.sign-up.form.inputs.password.placeholder' | translate"
				[control]="form.controls.password"
				[label]="'identity.sign-up.form.inputs.password.label' | translate"/>

			<form-input-password
				id="passwordConfirm"
				autocomplete="passwordConfirm"
				[placeholder]="'identity.sign-up.form.inputs.password-confirm.placeholder' | translate"
				[control]="form.controls.passwordConfirm"
				[label]="'identity.sign-up.form.inputs.password-confirm.label' | translate"/>

			<div>
				<button (click)="signUp()" type="submit" primary [isLoading]="form.pending">
					{{ 'keyword.capitalize.signUp' | translate }}
				</button>
			</div>

			<identity-already-sign-up-link-component/>
		</form>

	`,
	imports: [
		ReactiveFormsModule,
		HasErrorDirective,
		NgIf,
		TranslateModule,
		FirstKeyNameModule,
		RouterLink,
		DeleteButtonComponent,
		InvalidTooltipDirective,
		IsRequiredDirective,
		FormInputComponent,
		FormInputPasswordComponent,
		AlreadySignUpLinkComponent,
		PrimaryLinkStyleDirective,
		PrimaryButtonDirective,
	]
})
export class SignUpComponent {

	public readonly identityApiAdapter = inject(IdentityApiAdapter);

	public readonly form = new RegistrationForm();
	private readonly router = inject(Router);
	public readonly signUpAfterSuccess = new BooleanState(false);
	public emailUrl = new URL('https://beeoclock.com');

	public async signUp(): Promise<void> {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			const value = this.form.getRawValue();
			await firstValueFrom(this.identityApiAdapter.postCreateUser$(value))
				.then(async () => {
					if (value.email) {
						this.emailUrl = new URL(`https://${value.email.split('@')[1]}`);
					}
					this.signUpAfterSuccess.switchOn();
				})
				.finally(() => {
					this.form.enable();
					this.form.updateValueAndValidity();
				});
		} else {
			this.form.enable();
			this.form.updateValueAndValidity();
		}
	}

}
