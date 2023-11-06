import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActiveEnum} from "@utility/domain/enum";
import {noWhitespaceValidator} from "@utility/validation/whitespace";
import {
	atLeastOneFieldMustBeFilledValidator
} from "@customer/presentation/form/validation/atLeastOneFieldMustBeFilled.validation";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {inject} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {SwitchActiveBlockComponent} from "@utility/presentation/component/switch-active/switch-active-block.component";

export const enum CustomerFormFieldsEnum {
	_id = '_id',

	firstName = 'firstName',
	lastName = 'lastName',
	note = 'note',
	email = 'email',
	phone = 'phone',

	active = 'active',
}

export interface ICustomerForm {
	[CustomerFormFieldsEnum._id]: FormControl<string>;

	[CustomerFormFieldsEnum.firstName]: FormControl<string>;
	[CustomerFormFieldsEnum.lastName]: FormControl<string>;
	[CustomerFormFieldsEnum.note]: FormControl<string>;
	[CustomerFormFieldsEnum.email]: FormControl<string>;
	[CustomerFormFieldsEnum.phone]: FormControl<string>;

	[CustomerFormFieldsEnum.active]: FormControl<ActiveEnum>;

}

export class CustomerForm extends FormGroup<ICustomerForm> {

	private readonly translateService = inject(TranslateService);

	public readonly components = {
		[CustomerFormFieldsEnum.firstName]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-firstName',
				type: 'string',
				label: this.translateService.instant('keyword.capitalize.firstName'),
				placeholder: this.translateService.instant('keyword.capitalize.firstName'),
				autocomplete: CustomerFormFieldsEnum.firstName,
				control: this.controls.firstName,
			}
		},
		[CustomerFormFieldsEnum.lastName]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-lastName',
				type: 'string',
				label: this.translateService.instant('keyword.capitalize.lastName'),
				placeholder: this.translateService.instant('keyword.capitalize.lastName'),
				autocomplete: CustomerFormFieldsEnum.lastName,
				control: this.controls.lastName,
			}
		},
		[CustomerFormFieldsEnum.email]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-email',
				type: 'email',
				label: this.translateService.instant('keyword.capitalize.email'),
				placeholder: 'firstname.lastname@example.com',
				autocomplete: CustomerFormFieldsEnum.email,
				control: this.controls.email,
			}
		},
		[CustomerFormFieldsEnum.phone]: {
			componentRef: FormInputComponent,
			inputs: {
				id: 'customer-form-phone',
				type: 'phone',
				label: this.translateService.instant('keyword.capitalize.phone'),
				placeholder: '+000000000000',
				autocomplete: CustomerFormFieldsEnum.phone,
				control: this.controls.phone,
			}
		},
		[CustomerFormFieldsEnum.note]: {
			componentRef: FormTextareaComponent,
			inputs: {
				id: 'customer-form-note',
				label: this.translateService.instant('keyword.capitalize.note'),
				placeholder: this.translateService.instant('customer.form.input.note.placeholder'),
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
		super({
			[CustomerFormFieldsEnum._id]: new FormControl(),

			[CustomerFormFieldsEnum.firstName]: new FormControl(),
			[CustomerFormFieldsEnum.lastName]: new FormControl(),
			[CustomerFormFieldsEnum.email]: new FormControl(),
			[CustomerFormFieldsEnum.phone]: new FormControl(),

			[CustomerFormFieldsEnum.note]: new FormControl(),

			[CustomerFormFieldsEnum.active]: new FormControl(),
		});
		this.initValue();
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

	private initValue(): void {
		this.controls.active.setValue(ActiveEnum.YES);
	}

	public initValidation(): void {
		this.controls.email.setValidators([Validators.email, noWhitespaceValidator()]);
		this.controls.phone.setValidators([noWhitespaceValidator()]);

		this.addValidators(atLeastOneFieldMustBeFilledValidator(['_id', 'active', 'note']));
	}
}
