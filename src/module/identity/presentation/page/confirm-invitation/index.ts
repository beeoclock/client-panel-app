import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {IBodyConfirmInvitation, IQueryParamsConfirmInvitation} from "@identity/domain/interface/i.confirm-invitation";
import {filter} from "rxjs";
import {is} from "thiis";
import {ConfirmInvitationForm} from "@identity/presentation/form/confirm-invitation.form";
import {ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";
import {TranslateModule} from "@ngx-translate/core";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {ChangeLanguageComponent} from "@utility/presentation/component/change-language/change-language.component";
import {NgOptimizedImage} from "@angular/common";
import {SignInComponent} from "@identity/presentation/component/sign-in.component/sign-in.component";
import {ConfirmInvitationApiAdapter} from "@identity/adapter/external/api/confirm-invitation.api.adapter";
import {NGXLogger} from "ngx-logger";

@Component({
	selector: 'identity-confirm-invitation-page',
	templateUrl: './index.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		FormInputPasswordComponent,
		TranslateModule,
		PrimaryButtonDirective,
		ChangeLanguageComponent,
		NgOptimizedImage,
		RouterLink,
		SignInComponent
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

	private readonly confirmInvitationApiAdapter = inject(ConfirmInvitationApiAdapter);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly router = inject(Router);
	public readonly form = new ConfirmInvitationForm();

	public ngOnInit() {
		this.activatedRoute.queryParams.pipe(
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
			this.router.navigate(['/', 'identity']);
		}).catch(() => {
			this.form.enable();
			this.form.updateValueAndValidity();
		});
	}

}
