import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostBinding,
	inject,
	OnInit,
	ViewEncapsulation
} from '@angular/core';
import ResetPasswordForm from "@identity/identity/presentation/form/reset-password.form";
import {Router} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {BackLinkComponent} from "@shared/presentation/component/link/back.link.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ChangeLanguageComponent} from "@shared/presentation/component/change-language/change-language.component";
import {ToastController} from "@ionic/angular/standalone";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {ForgotPasswordApiAdapter} from "@identity/identity/infrastructure/api/forgot-password.api.adapter";
import {NgOptimizedImage} from "@angular/common";
import {MS_THREE_SECONDS} from "@shared/domain/const/c.time";
import {AnalyticsService} from "@core/cdk/analytics.service";

@Component({
	selector: 'app-forgot-password-identity-page',
	templateUrl: './forgot-password.identity.page.html',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		BackLinkComponent,
		TranslateModule,
		ChangeLanguageComponent,
		PrimaryButtonDirective,
		NgOptimizedImage,
	],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordIdentityPage implements OnInit {

	public readonly form = new ResetPasswordForm();
	@HostBinding()
	public class = 'col-md-7 d-flex flex-center';
	readonly #analyticsService = inject(AnalyticsService);
	private readonly forgotPasswordApiAdapter = inject(ForgotPasswordApiAdapter);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	private readonly toastController = inject(ToastController);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public ngOnInit() {
		this.#analyticsService.logEvent('member_list_page_initialized');
	}

	public signIn(): void {

		this.form.markAllAsTouched();
		this.changeDetectorRef.detectChanges();

		if (this.form.valid) {
			this.form.disable();
			this.form.markAsPending();
			this.changeDetectorRef.detectChanges();

			const {email} = this.form.value;

			if (email) {

				this.forgotPasswordApiAdapter.executeAsync({
					email
				}).then(() => {
					this.toastController.create({
						header: this.translateService.instant('identity.forgot-password.form.label'),
						message: 'Success',
						color: 'success',
						position: 'top',
						duration: MS_THREE_SECONDS,
						buttons: [
							{
								text: this.translateService.instant('keyword.capitalize.close'),
								role: 'cancel',
							},
						],
					}).then((toast) => {
						toast.present().then(() => {
							this.router.navigate(['/', 'identity']).then();
						});
					});
					this.changeDetectorRef.detectChanges();
				}).finally(() => {
					this.form.enable();
					this.form.updateValueAndValidity();
					this.changeDetectorRef.detectChanges();
				});

			}

		} else {
			this.form.enable();
			this.form.updateValueAndValidity();
			this.changeDetectorRef.detectChanges();
		}

	}

}

export default ForgotPasswordIdentityPage;
