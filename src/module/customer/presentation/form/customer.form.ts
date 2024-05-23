import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";
import {noWhitespaceValidator} from "@utility/validation/whitespace";
import {
	atLeastOneFieldMustBeFilledValidator
} from "@customer/presentation/form/validation/atLeastOneFieldMustBeFilled.validation";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {
	SwitchActiveBlockComponent
} from "@utility/presentation/component/switch/switch-active/switch-active-block.component";
import {BaseEntityForm} from "@utility/base.form";

export const enum CustomerFormFieldsEnum {

	firstName = 'firstName',
	lastName = 'lastName',
	note = 'note',
	email = 'email',
	phone = 'phone',

	active = 'active',
}

export interface ICustomerForm {

	[CustomerFormFieldsEnum.firstName]: FormControl<string | null>;
	[CustomerFormFieldsEnum.lastName]: FormControl<string | null>;
	[CustomerFormFieldsEnum.note]: FormControl<string | null>;
	[CustomerFormFieldsEnum.email]: FormControl<string | null>;
	[CustomerFormFieldsEnum.phone]: FormControl<string | null>;

	[CustomerFormFieldsEnum.active]: FormControl<ActiveEnum>;

}

export class CustomerForm extends BaseEntityForm<'Customer', ICustomerForm> {

	public readonly components = {
		[CustomerFormFieldsEnum.firstName]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-firstName',
				inputType: 'text',
				labelTranslateKey: 'keyword.capitalize.firstName',
				placeholderTranslateKey: 'keyword.capitalize.firstName',
				autocomplete: CustomerFormFieldsEnum.firstName,
				control: this.controls.firstName,
			}
		},
		[CustomerFormFieldsEnum.lastName]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-lastName',
				inputType: 'text',
				labelTranslateKey: 'keyword.capitalize.lastName',
				placeholderTranslateKey: 'keyword.capitalize.lastName',
				autocomplete: CustomerFormFieldsEnum.lastName,
				control: this.controls.lastName,
			}
		},
		[CustomerFormFieldsEnum.email]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-email',
				inputType: 'email',
				labelTranslateKey: 'keyword.capitalize.email',
				placeholderTranslateKey: 'firstname.lastname@example.com',
				autocomplete: CustomerFormFieldsEnum.email,
				control: this.controls.email,
			}
		},
		[CustomerFormFieldsEnum.phone]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-phone',
				inputType: 'tel',
				labelTranslateKey: 'keyword.capitalize.phone',
				placeholderTranslateKey: '+000000000000',
				autocomplete: CustomerFormFieldsEnum.phone,
				control: this.controls.phone,
			}
		},
		[CustomerFormFieldsEnum.note]: {
			componentRef: FormTextareaComponent,
			inputs: {
				id: 'customer-form-note',
				labelTranslateKey: 'keyword.capitalize.note',
				placeholderTranslateKey: 'customer.form.input.note.placeholder',
				control: this.controls.note,
			}
		},
		[CustomerFormFieldsEnum.active]: {
			componentRef: SwitchActiveBlockComponent,
			inputs: {
				id: 'customer-form-active',
				control: this.controls.active,
			}
		},
	};

	public readonly componentList = [
		this.components[CustomerFormFieldsEnum.firstName],
		this.components[CustomerFormFieldsEnum.lastName],
		this.components[CustomerFormFieldsEnum.email],
		this.components[CustomerFormFieldsEnum.phone],
	];

	constructor() {
		super('Customer', {

			[CustomerFormFieldsEnum.firstName]: new FormControl(),
			[CustomerFormFieldsEnum.lastName]: new FormControl(),
			[CustomerFormFieldsEnum.email]: new FormControl(),
			[CustomerFormFieldsEnum.phone]: new FormControl(),

			[CustomerFormFieldsEnum.note]: new FormControl(),

			[CustomerFormFieldsEnum.active]: new FormControl(ActiveEnum.YES, {
				nonNullable: true,
			}),
		});
		this.initValidation();
	}

	public isNew(): boolean {
		return !this.controls._id.value;
	}

	public isNotNew(): boolean {
		return !this.isNew();
	}

	public isEmpty(): boolean {
		return Object.values(this.controls).every((control: AbstractControl) => {
			return control.value === null;
		});
	}

	public isNotEmpty(): boolean {
		return !this.isEmpty();
	}

	public initValidation(): void {
		this.controls.email.setValidators([Validators.email, noWhitespaceValidator()]);
		this.controls.phone.setValidators([noWhitespaceValidator()]);

		this.addValidators(atLeastOneFieldMustBeFilledValidator(['_id', 'active', 'note', 'object', 'createdAt', 'updatedAt']));
	}
}
