import {AbstractControl, ValidationErrors} from "@angular/forms";
import {USERNAME_REGEX} from "@utility/domain/const/c.regex";

export function USERNAME_ANGULAR_VALIDATOR() {
	return (control: AbstractControl): ValidationErrors | null => {
		const username: string = control.value;
		if (!username) {
			return null;
		}
		const usernameIsOk = username.match(USERNAME_REGEX);
		if (usernameIsOk) {
			return null;
		}
		return {
			username: true,
		};
	};
}
