import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function notNaNValidator(wrapper: CallableFunction, invalidKey = 'invalidFormat'): ValidatorFn {
  return (control: AbstractControl<number, number>): ValidationErrors | null => {
    const value = control.value;

    if (isNaN(wrapper(value))) {
      return {[invalidKey]: true}; // Value is NaN, return validation error
    } else {
      return null; // Value is not NaN, no validation error
    }
  };
}
