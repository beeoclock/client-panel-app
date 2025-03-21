import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {
	IBodyConfirmInvitation,
	IQueryParamsConfirmInvitation
} from "@src/identity/module/identity/domain/interface/i.confirm-invitation";
import {filter} from "rxjs";
import {is} from "@core/shared/checker";
import {ConfirmInvitationForm} from "@src/identity/module/identity/presentation/form/confirm-invitation.form";
import {ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {
	ConfirmInvitationApiAdapter
} from "@src/identity/module/identity/infrastructure/api/confirm-invitation.api.adapter";
import {NGXLogger} from "ngx-logger";
import {MS_THREE_SECONDS} from "@utility/domain/const/c.time";
import {ToastController} from "@ionic/angular/standalone";
import {Reactive} from "@utility/cdk/reactive";
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
	selector: 'app-confirm-invitation-identity-page',
	templateUrl: './confirm-invitation.identity.page.html',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		FormInputPasswordComponent,
		TranslateModule,
		PrimaryButtonDirective,
		ChangeLanguageComponent,
	],
	encapsulation: ViewEncapsulation.None
})
export class ConfirmInvitationIdentityPage extends Reactive implements OnInit {

	public readonly form = new ConfirmInvitationForm();
	private readonly confirmInvitationApiAdapter = inject(ConfirmInvitationApiAdapter);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	private readonly translateService = inject(TranslateService);
	private readonly toastController = inject(ToastController);
	readonly #analyticsService = inject(AnalyticsService);

	public ngOnInit() {
		this.#analyticsService.logEvent('confirm_invitation_page_initialized');
		this.activatedRoute.queryParams.pipe(
			this.takeUntil(),
			filter(is.object_not_empty<IQueryParamsConfirmInvitation>)
		).subscribe((params) => {
			this.form.patchValue(params);
			this.form.controls.email.disable();
			this.form.controls.businessName.disable();
		});
	}

	public async submit() {
		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		}
		this.form.disable();
		this.form.markAsPending();
		const body = this.form.value as IBodyConfirmInvitation;
		this.ngxLogger.info('submit', body);
		await this.confirmInvitationApiAdapter.executeAsync(body).then(() => {
			this.toastController.create({
				header: this.translateService.instant('keyword.capitalize.successfully'),
				message: this.translateService.instant('identity.confirmInvitation.success'),
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

					this.router.navigate(['/', 'identity']);

				});

			});
		}).catch(() => {
			this.form.enable();
			this.form.updateValueAndValidity();
		});
	}

}

export default ConfirmInvitationIdentityPage;
