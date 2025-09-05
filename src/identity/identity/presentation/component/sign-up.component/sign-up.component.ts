import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import RegistrationForm from '@identity/identity/presentation/form/registration.form';
import {IdentityApiAdapter} from "@identity/identity/infrastructure/api/identity.api.adapter";
import {FormInputComponent} from "@shared/presentation/ui/component/input/form.input.component";
import {FormInputPasswordComponent} from "@shared/presentation/ui/component/input/form.input.password.component";
import {BooleanState} from "@shared/domain";
import {AlreadySignUpLinkComponent} from "@identity/identity/presentation/component/link/alredy-sign-up.link.component";
import {PrimaryLinkStyleDirective} from "@shared/presentation/directives/link/primary.link.style.directive";
import {ChangeLanguageComponent} from "@shared/presentation/ui/component/change-language/change-language.component";
import {NgOptimizedImage} from "@angular/common";
import {firstValueFrom} from "rxjs";

@Component({
	selector: 'identity-sign-up-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	template: `

		<!-- Hero -->
		<div
			class="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
			<div
				class="flex items-center justify-center lg:px-8 lg:py-14 max-w-[85rem] min-h-screen mx-auto px-4 py-4 sm:px-6">

				@if (signUpAfterSuccess.isOn) {


					<div class="max-w-md flex flex-col gap-4">
						<utility-change-language-component class="self-end"/>
						<div
							class="p-4 sm:p-7 gap-4 text-center items-center flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900 justify-center">
							<div class="text-green-500 text-4xl">
								<i class="bi bi-check-circle"></i>
							</div>

							<div class="text-2xl">
								{{ 'identity.sign-up.afterSuccess.youHaveSuccessfullyRegistered' | translate }}
							</div>

							<div class="">
								{{ 'identity.sign-up.afterSuccess.nextStep' | translate }}
							</div>

							<div class="">
								{{ 'identity.sign-up.afterSuccess.weSentEmail' | translate }}
								<strong>{{ form.controls.email.value }}</strong>.
							</div>

							<a [href]="emailUrl.href" primaryLinkStyle class="justify-center flex-col">
								<span>{{ 'identity.sign-up.afterSuccess.openMailService' | translate }}</span>
								<span><strong>{{ emailUrl.host }}</strong>&nbsp;<i class="bi bi-arrow-right"></i></span>
							</a>
						</div>
					</div>
				}

				@if (signUpAfterSuccess.isOff) {

					<!-- Grid -->
					<div class="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
						<div>
							<p class="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
								{{ 'identity.sign-up.hint.successfulInCurrentYear' | translate: {currentYear} }}
							</p>

							<!-- Title -->
							<div class="mt-4 md:mb-12 max-w-2xl">
								<h1 class="mb-4 font-semibold text-gray-800 text-2xl lg:text-5xl dark:text-neutral-200">
									{{ 'identity.sign-up.hint.mainText' | translate }}
								</h1>
								<p class="text-gray-600 dark:text-neutral-400">
									{{ 'identity.sign-up.hint.subBainText' | translate }}
								</p>
							</div>
							<!-- End Title -->

							<!-- Blockquote -->
							<blockquote class="hidden md:block relative max-w-sm">
								<svg
									class="absolute top-0 start-0 transform -translate-x-6 -translate-y-8 size-16 text-gray-200 dark:text-neutral-800"
									width="16" height="16" viewBox="0 0 16 16" fill="none"
									xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path
										d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
										fill="currentColor"/>
								</svg>

								<div class="relative z-10">
									<p class="text-xl italic text-gray-800 dark:text-white"
									   [innerHTML]="'identity.sign-up.hint.quote' | translate">
									</p>
								</div>

								<footer class="mt-3">
									<div class="flex items-center gap-x-4">
										<div class="shrink-0">
											<img class="size-8 rounded-full"
												 width="32"
												 height="32"
												 ngSrc="https://karbashevskyi.github.io/nx-monorepo/cv/en-US/images/Ivan-Karbashevskyi.jpeg"
												 alt="Ivan's photo">
										</div>
										<div class="grow">
											<div class="font-semibold text-gray-800 dark:text-neutral-200">Ivan
												Karbashevskyi
											</div>
											<div class="text-xs text-gray-500 dark:text-neutral-500">Co-Founder | Bee
												O'clock
											</div>
										</div>
									</div>
								</footer>
							</blockquote>
							<!-- End Blockquote -->
						</div>
						<!-- End Col -->

						<div>
							<!-- Form -->
							<form>
								<div class="w-full max-w-sm lg:mx-auto lg:me-0 ms-auto flex flex-col gap-4">
									<utility-change-language-component class="self-end"/>
									<!-- Card -->
									<div
										class="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">

										<div class="text-start">

											<img class="h-10 w-auto"
												 ngSrc="/asset/img/logo.png"
												 alt="Bee O\`clock" height="278" width="278">

											<h1 class="block text-2xl font-bold text-gray-800 dark:text-white mt-10">
												{{ 'identity.sign-up.form.label' | translate }}
											</h1>
											<identity-already-sign-up-link-component/>
										</div>

										<div class="mt-5">

											<!-- Grid -->
											<div class="flex flex-col gap-4">

												<form-input
													id="email"
													inputType="email"
													autocomplete="email"
													[autofocus]="true"
													[placeholder]="'identity.sign-up.form.inputs.email.placeholder' | translate"
													[control]="form.controls.email"
													[label]="'identity.sign-up.form.inputs.email.label' | translate"/>

												<form-input-password
													id="password"
													autocomplete="password"
													[placeholder]="'identity.sign-up.form.inputs.password.placeholder' | translate"
													[control]="form.controls.password"
													[label]="'identity.sign-up.form.inputs.password.label' | translate"/>

											</div>
											<!-- End Grid -->

											<div class="mt-5">
												<button type="submit"
														(click)="signUp()"
														[disabled]="form.pending"
														role="button"
														class="w-full p-4 transition-all inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
													@if (form.pending) {
														<span class="animate-spin">
															<i class="bi bi-arrow-repeat"></i>
														</span>
													} @else {
														{{ 'keyword.capitalize.signUp' | translate }}
													}
												</button>
											</div>
										</div>
									</div>
									<!-- End Card -->
								</div>
							</form>
							<!-- End Form -->
						</div>
						<!-- End Col -->

					</div>
					<!-- End Grid -->

				}
			</div>
			<!-- End Clients Section -->
		</div>
		<!-- End Hero -->
	`,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		FormInputComponent,
		FormInputPasswordComponent,
		AlreadySignUpLinkComponent,
		PrimaryLinkStyleDirective,
		ChangeLanguageComponent,
		NgOptimizedImage,
	]
})
export class SignUpComponent  {


	public readonly identityApiAdapter = inject(IdentityApiAdapter);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly form = new RegistrationForm();
	public readonly signUpAfterSuccess = new BooleanState(false);
	public emailUrl = new URL('https://beeoclock.com');


	public readonly currentYear = new Date().getFullYear();

	public async signUp(): Promise<void> {
		this.form.markAllAsTouched();
		this.changeDetectorRef.detectChanges();
		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			this.changeDetectorRef.detectChanges();
			const value = this.form.getRawValue();
			await firstValueFrom(this.identityApiAdapter.postCreateUser$(value))
				.then(async () => {
					if (value.email) {
						this.emailUrl = new URL(`https://${value.email.split('@')[1]}`);
					}
					this.signUpAfterSuccess.switchOn();
					this.changeDetectorRef.detectChanges();
				})
				.finally(() => {
					this.form.enable();
					this.form.updateValueAndValidity();
					this.changeDetectorRef.detectChanges();
				});
		} else {
			this.form.enable();
			this.form.updateValueAndValidity();
			this.changeDetectorRef.detectChanges();
		}
	}

}
