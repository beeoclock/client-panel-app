import {AbstractControl, FormControl, Validators} from '@angular/forms';
import {noWhitespaceValidator} from "@utility/validation/whitespace";
import {
	atLeastOneFieldMustBeFilledValidator
} from "@customer/presentation/form/validation/atLeastOneFieldMustBeFilled.validation";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {BaseEntityForm} from "@utility/base.form";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {ICustomer} from "@customer/domain";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {TelFormInputComponent} from "@utility/presentation/component/tel-form-input/tel.form.input.component";
import {StateEnum} from "@utility/domain/enum/state.enum";
import {ActiveEnum} from "@utility/domain/enum";

export const enum CustomerFormFieldsEnum {

	firstName = 'firstName',
	lastName = 'lastName',
	note = 'note',
	email = 'email',
	phone = 'phone',
	customerType = 'customerType',

	active = 'active',
	state = 'state',
	stateHistory = 'stateHistory',
}

export interface ICustomerForm {

	[CustomerFormFieldsEnum.firstName]: FormControl<string | null>;
	[CustomerFormFieldsEnum.lastName]: FormControl<string | null>;
	[CustomerFormFieldsEnum.note]: FormControl<string | null>;
	[CustomerFormFieldsEnum.email]: FormControl<string | null>;
	[CustomerFormFieldsEnum.phone]: FormControl<string | null>;

	[CustomerFormFieldsEnum.active]: FormControl<ActiveEnum>;
	[CustomerFormFieldsEnum.state]: FormControl<StateEnum>;
	[CustomerFormFieldsEnum.stateHistory]: FormControl<{state: StateEnum; setAt: string}[]>;
	[CustomerFormFieldsEnum.customerType]: FormControl<CustomerTypeEnum>;

}

export class CustomerForm extends BaseEntityForm<'CustomerDto', ICustomerForm> {

	private readonly destroy$ = new Subject<void>();

	public readonly regularCaseValidator = atLeastOneFieldMustBeFilledValidator([
		CustomerFormFieldsEnum.email,
		CustomerFormFieldsEnum.phone
	]);

	public readonly unregisteredCaseValidator = atLeastOneFieldMustBeFilledValidator([
		CustomerFormFieldsEnum.firstName,
		CustomerFormFieldsEnum.lastName
	]);

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
			componentRef: TelFormInputComponent,
			inputs: {
				id: 'customer-form-phone',
				labelTranslateKey: 'keyword.capitalize.phone',
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
		}
	};

	public readonly componentList = [
		this.components[CustomerFormFieldsEnum.firstName],
		this.components[CustomerFormFieldsEnum.lastName],
		this.components[CustomerFormFieldsEnum.email],
		this.components[CustomerFormFieldsEnum.phone],
	];

	constructor() {
		super('CustomerDto', {

			[CustomerFormFieldsEnum.firstName]: new FormControl(),
			[CustomerFormFieldsEnum.lastName]: new FormControl(),
			[CustomerFormFieldsEnum.email]: new FormControl(),
			[CustomerFormFieldsEnum.phone]: new FormControl(),

			[CustomerFormFieldsEnum.note]: new FormControl(),

			[CustomerFormFieldsEnum.customerType]: new FormControl(CustomerTypeEnum.new, {
				nonNullable: true,
			}),
		});
		this.initValidation();
		this.initHandlers();
	}

	public isNew(): boolean {
		return this.controls.customerType.value === CustomerTypeEnum.new;
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

		this.detectValidators(this.getRawValue().customerType);

	}

	public addValidatorsForRegularCase(): void {
		this.addValidators(this.regularCaseValidator);
	}

	public removeValidatorsForRegularCase(): void {
		this.removeValidators(this.regularCaseValidator);
	}

	public addValidatorsForUnregisteredCase(): void {
		this.addValidators(this.unregisteredCaseValidator);
	}

	public removeValidatorsForUnregisteredCase(): void {
		this.removeValidators(this.unregisteredCaseValidator);
	}

	public static create(initValue: Partial<ICustomer.Entity> = {}): CustomerForm {

		const form = new CustomerForm();

		form.patchValue(initValue);

		return form;

	}

	public initHandlers(): void {

		this.controls.customerType.valueChanges.pipe(
			takeUntil(this.destroy$)
		).subscribe((customerType) => {

			this.detectValidators(customerType);

		});

	}

	public destroyHandlers(): void {

		this.destroy$.next();
		this.destroy$.complete();

	}

	private detectValidators(customerType: CustomerTypeEnum): void {
		this.removeValidatorsForRegularCase();
		this.removeValidatorsForUnregisteredCase();

		switch (customerType) {
			case CustomerTypeEnum.new:
			case CustomerTypeEnum.regular:
				this.addValidatorsForRegularCase();
				break;

			case CustomerTypeEnum.unregistered:
				this.addValidatorsForUnregisteredCase();
				break;
		}
	}
}
