import {FormControl} from '@angular/forms';
import {BaseEntityForm} from "@shared/base.form";
import {IExpense} from "@tenant/expense/expense/domain";

export type IExpenseForm = {
	[K in keyof IExpense.DTO]: FormControl<IExpense.DTO[K]>;
};

export class ExpenseForm extends BaseEntityForm<'ExpenseDto', IExpenseForm> {

	constructor() {
		super('ExpenseDto', {
			description: new FormControl(),
			expensedAt: new FormControl(),
			items: new FormControl(),
			totalValue: new FormControl(),
		});


	}


	public static create(initialValues: Partial<IExpense.DTO> = {}): ExpenseForm {
		const form = new ExpenseForm();
		form.patchValue(initialValues);
		return form;
	}

}
