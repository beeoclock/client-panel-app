import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function emailOrPhoneRequiredValidator(): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const email = formGroup.get('email')?.value;
		const phone = formGroup.get('phone')?.value;

		// Check if either email or phone is provided
		if (!email && !phone) {
			return { emailOrPhoneRequired: true };
		}

		return null; // Validation passed
	};
}
