import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonTitle,
	IonToggle,
	IonToolbar,
	ModalController
} from "@ionic/angular/standalone";

@Component({
	selector: 'cpa-notification-setting',
	standalone: true,
	imports: [
		TranslateModule,
		ReactiveFormsModule,
		IonItem,
		IonToggle,
		IonContent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonButtons,
		IonButton,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './notification-settings.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class NotificationSettingsComponent {
	private readonly modalCtrl: ModalController = inject(ModalController);
	@Input() public askSmsNotifications: boolean = false;
	@Input() public askEmailNotifications: boolean = false;

	public sendTypesFormGroup: FormGroup<{
		sms: FormControl<boolean>,
		email: FormControl<boolean>
	}> = new FormGroup({sms: new FormControl(), email: new FormControl()});

	public confirm(): void {
		const formValue = this.sendTypesFormGroup.value;
		this.modalCtrl.dismiss(Object.keys(formValue).filter((key) => !!formValue[key as keyof typeof this.sendTypesFormGroup.controls])).then();
	}

}
