import {FormControl, FormGroup} from "@angular/forms";


export interface IEventConfigurationForm {
	ignoreEventChecks: FormControl<boolean>;
}

export class EventConfigurationForm extends FormGroup<IEventConfigurationForm> {
	constructor() {
		super({
			ignoreEventChecks: new FormControl(),
		});
	}

}
