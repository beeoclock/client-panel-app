import {Component, inject, Input} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'cpa-notification-setting',
	standalone: true,
	imports: [
		IonicModule,
		TranslateModule,
		ReactiveFormsModule
	],
	templateUrl: './notification-settings.component.html',
	styles: ``
})
export class NotificationSettingsComponent {
	private modalCtrl: ModalController = inject(ModalController);
	@Input() public askSmsNotifications: boolean | undefined;
	@Input() public askEmailNotifications: boolean | undefined;

	public sendTypesFormGroup: FormGroup<{
		sms: FormControl<boolean>,
		email: FormControl<boolean>
	}> = new FormGroup({sms: new FormControl(), email: new FormControl()});

	confirm() {
		const formValue = this.sendTypesFormGroup.value;
		return this.modalCtrl.dismiss(Object.keys(formValue).filter((key) => !!formValue[key as keyof typeof this.sendTypesFormGroup.controls]));
	}

}
