import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

export interface IFilterForm {

	phrase: FormControl<string>;
	// start: FormControl<string>;
	// end: FormControl<string>;

  [key: string]: AbstractControl<any, any>;

}

export class FilterForm extends FormGroup<IFilterForm> {
  constructor() {
    super({
			phrase: new FormControl(),
			// start: new FormControl(),
			// end: new FormControl(),
    });
		// this.initValue();
  }

	// public initValue(): void {
	// 	const start = new Date();
	// 	start.setDate(start.getDate() - 7);
	// 	start.setHours(0);
	// 	start.setMinutes(0);
	// 	start.setSeconds(0);
	// 	this.controls.start.setValue(start.toISOString());
	// 	const end = new Date();
	// 	end.setDate(end.getDate() + 8);
	// 	end.setHours(0);
	// 	end.setMinutes(0);
	// 	end.setSeconds(0);
	// 	this.controls.end.setValue(end.toISOString());
	// }
}
