import {AbstractControl, ValidatorFn} from "@angular/forms";
import {is} from "@core/shared/checker";

export function atLeastOneFieldMustBeFilledValidator(include: string[] = [], exclude: string[] = []): ValidatorFn {
	return (control: AbstractControl) => {
		if (is.object(control.value)) {
			const formValue = control.getRawValue();
			const formValueKeys = Object.keys(formValue);

			let formValueValues: any[] = [];

			if (include.length) (formValueValues = formValueKeys.filter((key) => include.includes(key)).map((key) => formValue[key]));
			if (exclude.length) (formValueValues = formValueKeys.filter((key) => !exclude.includes(key)).map((key) => formValue[key]));

			const everyFieldIsEmpty = formValueValues.every((formValue) => is.null(formValue) || is.string_empty(formValue));

			if (everyFieldIsEmpty) {
				return {
					atLeastOneFieldMustBeFilled: true
				}
			}
		}
		return null;
	};
}
