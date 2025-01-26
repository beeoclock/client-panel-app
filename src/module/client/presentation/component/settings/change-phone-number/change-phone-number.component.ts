import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ToastController} from "@ionic/angular";
import {ChangePhoneNumberClientAdapter} from "@identity/adapter/external/module/change-phone-number.client.adapter";
import {ChangePhoneNumberForm} from "@client/presentation/form/change-phone-number.form";
import {MS_THREE_SECONDS} from "@utility/domain/const/c.time";
import {TelFormInputComponent} from "@utility/presentation/component/tel-form-input/tel.form.input.component";

@Component({
	selector: 'client-change-phone-number-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		TelFormInputComponent
	],
	template: `

		<div class="pb-4">

			<tel-form-input
				id="client-form-phoneNumber"
				[placeholder]="'change-phone-number.form.input.phoneNumber.placeholder' | translate"
				[control]="form.controls.phoneNumber"
				[label]="'keyword.capitalize.phone' | translate"
				autocomplete="phoneNumber"/>

		</div>

	`,
	host: {
		class: `block md:min-h-[300px]`
	}
})
export class ChangePhoneNumberComponent {

	public readonly form = new ChangePhoneNumberForm();
	private readonly changePhoneNumberClientAdapter = inject(ChangePhoneNumberClientAdapter);
	private readonly toastController = inject(ToastController);
	private readonly translateService = inject(TranslateService);

	public async submit(): Promise<unknown> {
		this.form.markAsPending();
		return this.changePhoneNumberClientAdapter.changePhoneNumberApiAdapter.executeAsync(this.form.value)
			.then((result) => {
				this.toastController.create({
					header: this.translateService.instant('change-phone.modal.title'),
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
