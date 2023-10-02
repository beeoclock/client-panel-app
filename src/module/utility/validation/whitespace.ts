import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && /^\s*$/.test(control.value)) {
      return {onlySpaces: true};
    }
    return null;
  };
}

export function noWhitespaceValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (control.value && /\s/.test(control.value)) {
			return { whitespace: true }; // Validation failed, there is whitespace
		}
		return null; // Validation passed, no whitespace
	};
}
