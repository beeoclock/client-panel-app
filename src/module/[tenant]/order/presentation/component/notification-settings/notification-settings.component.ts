import {Component, inject, input} from '@angular/core';
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
	private readonly modalCtrl: ModalController = inject(ModalController);
	public readonly askSmsNotifications = input<boolean>();
	public readonly askEmailNotifications = input<boolean>();

	public sendTypesFormGroup: FormGroup<{
		sms: FormControl<boolean>,
		email: FormControl<boolean>
	}> = new FormGroup({sms: new FormControl(), email: new FormControl()});

	public confirm(): void {
		const formValue = this.sendTypesFormGroup.value;
		this.modalCtrl.dismiss(Object.keys(formValue).filter((key) => !!formValue[key as keyof typeof this.sendTypesFormGroup.controls])).then();
	}

}
