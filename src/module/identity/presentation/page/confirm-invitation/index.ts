import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {IQueryParamsConfirmInvitation} from "@identity/domain/interface/i.confirm-invitation";
import {filter} from "rxjs";
import {is} from "thiis";
import {ConfirmInvitationForm} from "@identity/presentation/form/confirm-invitation.form";
import {ReactiveFormsModule} from "@angular/forms";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormInputPasswordComponent} from "@utility/presentation/component/input/form.input.password.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'identity-confirm-invitation-page',
	templateUrl: './index.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ReactiveFormsModule,
		FormInputComponent,
		FormInputPasswordComponent,
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export default class Index implements OnInit {

	private readonly activatedRoute = inject(ActivatedRoute);
	public readonly form = new ConfirmInvitationForm();

	public ngOnInit() {
		this.activatedRoute.queryParams.pipe(
			filter(is.object_not_empty<IQueryParamsConfirmInvitation>)
		).subscribe((params) => {
			console.log(params)
			this.form.patchValue(params);
			this.form.controls.email.disable();
			this.form.controls.businessName.disable();
			console.log(this.form.value)
		});
	}

}
