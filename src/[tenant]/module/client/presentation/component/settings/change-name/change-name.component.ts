import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ChangeNameForm} from "@client/presentation/form/change-name.form";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {ChangeNameClientAdapter} from "@src/identity/module/identity/infrastructure/module/change-name.client.adapter";
import {ToastController} from "@ionic/angular/standalone";
import {MS_THREE_SECONDS} from "@utility/domain/const/c.time";

@Component({
	selector: 'client-change-name-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		FormInputComponent
	],
	template: `

		<div class="pb-4">

			<form-input
				id="client-form-name"
				inputType="text"
				autocomplete="name"
				[placeholder]="'change-name.form.input.name.placeholder' | translate"
				[control]="form.controls.name"
				[label]="'keyword.capitalize.fullName' | translate"/>

		</div>

	`
})
export class ChangeNameComponent {

	public form = new ChangeNameForm();
	private readonly changeNameClientAdapter = inject(ChangeNameClientAdapter);
	private readonly toastController = inject(ToastController);
	private readonly translateService = inject(TranslateService);

	public submit(): Promise<unknown> {
		this.form.markAsPending();
		return this.changeNameClientAdapter.changeNameApiAdapter.executeAsync(this.form.value)
			.then((result) => {
				this.toastController.create({
					header: this.translateService.instant('change-name.modal.title'),
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
					toast.present().then();
				});
				return result;
			})
			.catch(() => {
				this.form.markAsPristine();
			});
	}

}
