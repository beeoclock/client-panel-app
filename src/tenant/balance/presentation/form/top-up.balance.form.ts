import {AbstractControl, FormControl} from '@angular/forms';
import {BaseEntityForm} from "@shared/base.form";
import {IBalance} from "@tenant/balance/domain";
import {CurrencyCodeEnum} from "@core/shared/enum";

export interface IBalanceForm {
	amount: FormControl<number>;
	currency: FormControl<CurrencyCodeEnum>;
}

export class TopUpBalanceForm extends BaseEntityForm<'TopUpBalanceDto', IBalanceForm> {

	public constructor() {
		super('TopUpBalanceDto', {
			amount: new FormControl<number>(0, {
				nonNullable: true,
			}),
			currency: new FormControl<CurrencyCodeEnum>(CurrencyCodeEnum.USD, {
				nonNullable: true,
			}),
		});
	}

	public isEmpty(): boolean {
		return Object.values(this.controls).every((control: AbstractControl) => {
			return control.value === null;
		});
	}

	public isNotEmpty(): boolean {
		return !this.isEmpty();
	}

	public static create(initValue: Partial<IBalance.EntityRaw> = {}): TopUpBalanceForm {

		const form = new TopUpBalanceForm();

		const {object, ...initValueWithoutObject} = initValue;
		form.patchValue(initValueWithoutObject);

		return form;

	}

}
