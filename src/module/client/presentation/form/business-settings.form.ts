import {FormControl, FormGroup, Validators} from "@angular/forms";

export interface IBusinessSettingsForm {

	object: FormControl<'BusinessSettings'>;
	timeZone: FormControl<string>;
	timeZoneOffsetInMinutes: FormControl<number>;
}

export class BusinessSettingsForm extends FormGroup<IBusinessSettingsForm> {

	constructor() {
		super({
			object: new FormControl(),
			timeZone: new FormControl(),
			timeZoneOffsetInMinutes: new FormControl(),
		});

		this.initValue();
		this.initValidators();

	}

	private initValue(): void {
		this.controls.object.setValue('BusinessSettings');
		this.controls.timeZone.patchValue(Intl.DateTimeFormat().resolvedOptions().timeZone);
		this.controls.timeZoneOffsetInMinutes.setValue(new Date().getTimezoneOffset());
	}

	private initValidators(): void {
		this.controls.timeZone.setValidators(Validators.required);
		this.controls.timeZoneOffsetInMinutes.setValidators([
			Validators.required,
			Validators.min(-720),
			Validators.max(840),
		]);
	}

}
