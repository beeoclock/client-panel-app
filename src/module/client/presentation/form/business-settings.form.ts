import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LanguageCodeEnum} from "@utility/domain/enum";

export interface IBusinessSettingsForm {
	object: FormControl<'BusinessSettings'>;
	timeZone: FormControl<string>;
	availableLanguages: FormControl<LanguageCodeEnum[]>;
	emailLanguage: FormControl<LanguageCodeEnum>;
	timeZoneOffsetInMinutes: FormControl<number>;
}

export class BusinessSettingsForm extends FormGroup<IBusinessSettingsForm> {

	constructor() {
		super({
			object: new FormControl('BusinessSettings', {
				nonNullable: true,
			}),
			timeZone: new FormControl(Intl.DateTimeFormat().resolvedOptions().timeZone, {
				nonNullable: true,
			}),
			availableLanguages: new FormControl([LanguageCodeEnum.en], {
				nonNullable: true,
			}),
			emailLanguage: new FormControl(LanguageCodeEnum.en, {
				nonNullable: true,
			}),
			timeZoneOffsetInMinutes: new FormControl(new Date().getTimezoneOffset(), {
				nonNullable: true,
			}),
		});

		this.initValidators();

	}

	private initValidators(): void {
		this.controls.timeZone.setValidators(Validators.required);
		this.controls.availableLanguages.setValidators(Validators.required);
		this.controls.emailLanguage.setValidators(Validators.required);
		this.controls.timeZoneOffsetInMinutes.setValidators([
			Validators.required,
			Validators.min(-720),
			Validators.max(840),
		]);
	}

}
