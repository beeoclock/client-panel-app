import {AbstractControl, ValidatorFn} from "@angular/forms";
import {is} from "@utility/checker";

export function atLeastOneFieldMustBeFilledValidator(include: string[] = [], exclude: string[] = []): ValidatorFn {
	return (control: AbstractControl) => {
		if (is.object(control.value)) {
			const formValue = control.getRawValue();
			const formValueKeys = Object.keys(formValue);

			let formValueValues: any[] = [];

			include.length && (formValueValues = formValueKeys.filter((key) => include.includes(key)).map((key) => formValue[key]));
			exclude.length && (formValueValues = formValueKeys.filter((key) => !exclude.includes(key)).map((key) => formValue[key]));

			if (formValueValues.every(is.null)) {
				return {
					atLeastOneFieldMustBeFilled: true
				}
			}
		}
		return null;
	};
}
