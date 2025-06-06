import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostListener,
	inject,
	input,
	OnInit,
	ViewEncapsulation
} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Router, RouterLink} from '@angular/router';
import LoginForm from '@identity/identity/presentation/form/login.form';
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {Store} from "@ngxs/store";
import {IdentityActions} from "@identity/identity/presentation/state/identity/identity.actions";
import {firstValueFrom} from "rxjs";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@shared/presentation/component/input/form.input.password.component";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {ToastController} from "@ionic/angular/standalone";
import {NGXLogger} from "ngx-logger";
import {MS_THREE_SECONDS} from "@shared/domain/const/c.time";
import {is} from "@core/shared/checker";

@Component({
	selector: 'identity-sign-in-component',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="flex flex-col gap-6">
			<form-input
				id="email"
				inputType="email"
				autocomplete="email"
				placeholder="firstname.lastname@example.com"
				[control]="form.controls.email"
				[label]="'identity.sign-in.form.inputs.email.label' | translate"/>

			<form-input-password
				id="password"
				autocomplete="password"
				placeholder="password"
				[control]="form.controls.password"
				[label]="'identity.sign-in.form.inputs.password.label' | translate">
				<a
					label-bottom-end
					routerLink="/identity/forgot-password"
					class="font-semibold text-blue-600 dark:text-black hover:text-blue-500 text-sm">
					{{ 'identity.sign-in.link.forgotPassword' | translate }}
				</a>
			</form-input-password>

			<!--			<div class="flex items-center justify-between">-->
			<!--			<div class="flex items-start">-->
			<!--				<div class="flex items-center h-5">-->
			<!--					<input id="remember" aria-describedby="remember" type="checkbox"-->
			<!--								 class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"-->
			<!--								 required="">-->
			<!--				</div>-->
			<!--				<div class="ml-3 text-sm">-->
			<!--					<label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>-->
			<!--				</div>-->
			<!--			</div>-->
			<!--			</div>-->

			<div>
				<button (click)="signIn()" type="button" id="identity-sign-in-form-primary-button" primary
						[isLoading]="form.pending">
					{{ 'keyword.capitalize.signIn' | translate }}
				</button>
			</div>
		</div>
	`,
	standalone: true,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		RouterLink,
		FormInputComponent,
		FormInputPasswordComponent,
		PrimaryButtonDirective
	]
})
export class SignInComponent implements OnInit {

	public readonly initialValues = input<{
		email: string;
		password: string;
	}>({
		email: '',
		password: ''
	});

	public readonly form = new LoginForm();
	private readonly router = inject(Router);
	private readonly auth = inject(Auth);
	private readonly toastController = inject(ToastController);
	private readonly translateService = inject(TranslateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly store = inject(Store);
	private readonly logger = inject(NGXLogger);

	@HostListener('window:keyup.enter', ['$event'])
	public async onEnter(event: KeyboardEvent): Promise<void> {
		this.logger.debug('onEnter', event);
		await this.signIn();
	}

	public ngOnInit(): void {
		this.form.patchValue(this.initialValues());
	}

	public async signIn(): Promise<void> {

		this.form.markAllAsTouched();

		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();

			const {email, password} = this.form.value;
			await this.doSignIn(email, password);

		}

		this.enableAndUpdateForm();

	}

	public async doSignIn(email: string | unknown | null, password: string | unknown | null) {

		if (!is.string(email) || !is.string(password)) {
			return;
		}

		try {

			const {user} = await signInWithEmailAndPassword(this.auth, email, password);
			const token = await user.getIdTokenResult();
			await firstValueFrom(this.store.dispatch(new IdentityActions.Token(token)));
			if (user.emailVerified) {
				await this.router.navigate(['/', 'identity', 'corridor']);
			} else {
				await this.router.navigate(['/', 'identity', 'confirm-email']);
			}

		} catch (error) {

			const toast = await this.toastController.create({
				header: 'Error',
				message: 'Check your credentials',
				color: 'danger',
				position: 'top',
				duration: MS_THREE_SECONDS,
				buttons: [
					{
						text: this.translateService.instant('keyword.capitalize.close'),
						role: 'cancel',
					},
				],
			});
			await toast.present().then();

		}

	}

	private enableAndUpdateForm(): void {
		this.form.enable();
		this.form.updateValueAndValidity();
		this.changeDetectorRef.detectChanges();
	}

}
