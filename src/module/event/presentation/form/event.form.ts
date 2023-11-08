import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {IService} from "@service/domain";
import {AttendeesForm} from "@event/presentation/form/attendant.form";
import {filter} from "rxjs";
import {is} from "thiis";


export interface IEventForm {
	_id: FormControl<string>;
	servicesAreProvidedInParallel: FormControl<boolean>;
	services: FormControl<IService[]>;
	description: FormControl<string>;
	start: FormControl<string>;
	end: FormControl<string>;
	timeZone: FormControl<string>;
	attendees: AttendeesForm;
	[key: string]: AbstractControl;
}

export class EventForm extends FormGroup<IEventForm> {

	constructor() {
		super({
			_id: new FormControl(),
			description: new FormControl(),
			end: new FormControl(),
			start: new FormControl(),
			servicesAreProvidedInParallel: new FormControl(),
			services: new FormControl(),
			timeZone: new FormControl(),
			attendees: new AttendeesForm(),
		});
		this.initValidators();
		this.initValue();
		this.initHandler();
	}

	public restart(): void {
		Object.assign(this, new EventForm());
	}

	public initValidators(): void {
		this.controls.services.setValidators([Validators.required]);
		this.controls.start.setValidators([Validators.required]);
		this.controls.end.setValidators([Validators.required]);
		this.controls.attendees.setValidators([Validators.minLength(1)]);
	}

	public initValue(): void {
		this.controls.services.patchValue([]);
		this.controls.servicesAreProvidedInParallel.patchValue(false);
		// this.controls.end.patchValue(new Date().toISOString());
		// this.controls.start.patchValue(new Date().toISOString());
		this.controls.timeZone.patchValue(Intl.DateTimeFormat().resolvedOptions().timeZone);
	}

	public initHandler(): void {
		this.controls.start.valueChanges.pipe(filter(is.string)).subscribe((value) => {
			const [firstService] = this.controls.services.value;
			if (!firstService) {
				return;
			}
			const [firstDurationVersion] = firstService.durationVersions;
			const end = new Date(value);
			end.setSeconds(Number(new Date(value).getSeconds() + (firstDurationVersion.durationInSeconds ?? 0) + (firstDurationVersion.breakInSeconds ?? 0)));
			this.controls.end.patchValue(end.toISOString());
		});
	}

}
