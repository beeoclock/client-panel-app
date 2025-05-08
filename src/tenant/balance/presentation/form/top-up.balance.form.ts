import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {TopUpBalanceDto} from "@tenant/balance/application/dto/top-up-balance.dto";

export interface IBalanceForm {
	amount: FormControl<number>;
	currency: FormControl<CurrencyCodeEnum>;
	language: FormControl<LanguageCodeEnum>;

	redirectUrl: FormGroup<{
		cancelRedirectUrl: FormControl<string>;
		successRedirectUrl: FormControl<string>;
	}>;


}

export class TopUpBalanceForm extends FormGroup<IBalanceForm> {

	public constructor() {
		super({
			amount: new FormControl<number>(0, {
				nonNullable: true,
				validators: [Validators.min(1)],
			}),
			currency: new FormControl<CurrencyCodeEnum>(CurrencyCodeEnum.USD, {
				nonNullable: true,
			}),
			language: new FormControl<LanguageCodeEnum>(LanguageCodeEnum.en, {
				nonNullable: true,
			}),
			redirectUrl: new FormGroup({
				cancelRedirectUrl: new FormControl<string>('', {
					nonNullable: true,
				}),
				successRedirectUrl: new FormControl<string>('', {
					nonNullable: true,
				}),
			}),
		});
	}

	public static create(initValue: Partial<TopUpBalanceDto> = {}): TopUpBalanceForm {

		const form = new TopUpBalanceForm();

		form.patchValue(initValue);

		return form;

	}

}
