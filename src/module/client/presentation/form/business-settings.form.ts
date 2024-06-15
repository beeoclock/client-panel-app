import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";

export interface IBusinessSettingsForm {
	object: FormControl<'BusinessSettings'>;
	timeZone: FormControl<string>;
	availableLanguages: FormControl<LanguageCodeEnum[]>;
	baseLanguage: FormControl<LanguageCodeEnum>;
	emailLanguage: FormControl<LanguageCodeEnum>;
	currencies: FormControl<CurrencyCodeEnum[]>;
	baseCurrency: FormControl<CurrencyCodeEnum>;
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
			baseLanguage: new FormControl(),
			currencies: new FormControl([], {
				nonNullable: true,
			}),
			baseCurrency: new FormControl(),
			emailLanguage: new FormControl(LanguageCodeEnum.en, {
				nonNullable: true,
			}),
		});

		this.initValidators();

	}

	private initValidators(): void {
		this.controls.timeZone.setValidators(Validators.required);
		this.controls.baseLanguage.setValidators([Validators.required]);
		this.controls.emailLanguage.setValidators([Validators.required]);
		this.controls.availableLanguages.setValidators([Validators.required, Validators.minLength(1)]);
		this.controls.currencies.setValidators([Validators.required, Validators.minLength(1)]);
		this.controls.baseCurrency.setValidators([Validators.required]);
	}

}
