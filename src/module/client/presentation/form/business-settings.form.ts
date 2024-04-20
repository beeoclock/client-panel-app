import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";

export interface IBusinessSettingsForm {
	object: FormControl<'BusinessSettings'>;
	timeZone: FormControl<string>;
	availableLanguages: FormControl<LanguageCodeEnum[]>;
	emailLanguage: FormControl<LanguageCodeEnum>;
	currencies: FormControl<CurrencyCodeEnum[]>;
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
			currencies: new FormControl([], {
				nonNullable: true,
			}),
			emailLanguage: new FormControl(LanguageCodeEnum.en, {
				nonNullable: true,
			}),
		});

		this.initValidators();

	}

	private initValidators(): void {
		this.controls.timeZone.setValidators(Validators.required);
		this.controls.availableLanguages.setValidators([Validators.required, Validators.minLength(1)]);
		this.controls.emailLanguage.setValidators([Validators.required]);
		this.controls.currencies.setValidators([Validators.required, Validators.minLength(1)]);
	}

}
