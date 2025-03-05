import {AbstractControl, FormGroup, ValidationErrors} from "@angular/forms";

export function ShouldBeMoreThenValidation(form: FormGroup, theControlName: string,) {
	return (currentControl: AbstractControl): ValidationErrors | null => {
		const {value: currentValue} = currentControl;
		const {value: theValue} = form.controls[theControlName];

		if (!currentValue || !theValue) {
			return null;
		}

		if (theValue < currentValue) {
			return null;
		}
		return {['shouldBeMoreThen.' + theControlName]: true};
	}
}
