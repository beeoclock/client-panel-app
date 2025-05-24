import {FormControl, Validators} from '@angular/forms';
import {noWhitespaceValidator} from "@shared/validation/whitespace";
import {FormInputComponent} from "@shared/presentation/component/input/form.input.component";
import {BaseEntityForm} from "@shared/base.form";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

export const enum ExpenseCategoryFormFieldsEnum {

	name = 'name',
	description = 'description',

	state = 'state',
	stateHistory = 'stateHistory',
}

export interface IExpenseCategoryForm {

	[ExpenseCategoryFormFieldsEnum.name]: FormControl<string | null>;
	[ExpenseCategoryFormFieldsEnum.description]: FormControl<string | null>;

}

export class ExpenseCategoryForm extends BaseEntityForm<'ExpenseCategoryDto', IExpenseCategoryForm> {

	public readonly components = {
		[ExpenseCategoryFormFieldsEnum.name]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-name',
				inputType: 'text',
				labelTranslateKey: 'keyword.capitalize.name',
				placeholderTranslateKey: 'keyword.capitalize.name',
				autocomplete: ExpenseCategoryFormFieldsEnum.name,
				control: this.controls.name,
			}
		},
		[ExpenseCategoryFormFieldsEnum.description]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-description',
				inputType: 'text',
				labelTranslateKey: 'keyword.capitalize.description',
				placeholderTranslateKey: 'keyword.capitalize.description',
				autocomplete: ExpenseCategoryFormFieldsEnum.description,
				control: this.controls.description,
			}
		},
	};

	public readonly componentList = [
		this.components[ExpenseCategoryFormFieldsEnum.name],
		this.components[ExpenseCategoryFormFieldsEnum.description],
	];

	constructor() {
		super('ExpenseCategoryDto', {
			[ExpenseCategoryFormFieldsEnum.name]: new FormControl(),
			[ExpenseCategoryFormFieldsEnum.description]: new FormControl(),
		});
		this.initValidation();
	}

	public initValidation(): void {

		this.controls.name.setValidators([Validators.required, Validators.minLength(2), noWhitespaceValidator]);

	}


	public static create(initValue: Partial<IExpenseCategory.EntityRaw> = {}): ExpenseCategoryForm {

		const form = new ExpenseCategoryForm();

		form.patchValue(initValue);

		return form;

	}

}
