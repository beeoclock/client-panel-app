import {AbstractControl, ValidatorFn} from "@angular/forms";
import {is} from "thiis";

export const atLeastOneFieldMustBeFilledValidator = (ignoreField: string[] = []): ValidatorFn => {
	return (control: AbstractControl) => {
		if (is.object(control.value)) {
			const formValue = control.getRawValue();
			const formValueKeys = Object.keys(formValue);
			const formValueValues = formValueKeys.filter((key) => !ignoreField.includes(key)).map((key) => formValue[key]);
			if (formValueValues.every(is.null)) {
				return {
					atLeastOneFieldMustBeFilled: true
				}
			}
		}
		return null;
	};
};
