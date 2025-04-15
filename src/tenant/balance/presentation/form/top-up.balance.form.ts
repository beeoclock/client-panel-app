import {AbstractControl} from '@angular/forms';
import {BaseEntityForm} from "@shared/base.form";
import {Subject} from "rxjs";
import {IBalance} from "@tenant/balance/domain";

export const enum TopUpBalanceFormFieldsEnum {


	state = 'state',
	stateHistory = 'stateHistory',
}

export interface IBalanceForm {

}

export class TopUpBalanceForm extends BaseEntityForm<'TopUpBalanceDto', IBalanceForm> {

	private readonly destroy$ = new Subject<void>();


	constructor() {
		super('TopUpBalanceDto', {});
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
