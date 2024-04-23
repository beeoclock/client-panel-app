import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {IService} from "@service/domain";
import {AttendeesForm} from "@event/presentation/form/attendant.form";
import {EventConfigurationForm} from "@event/presentation/form/configuration.form";


export interface IEventForm {
	_id: FormControl<string>;
	servicesAreProvidedInParallel: FormControl<boolean>;
	services: FormControl<IService[]>;
	note: FormControl<string>;
	start: FormControl<string>;
	end: FormControl<string>;
	timeZone: FormControl<string>;
	attendees: AttendeesForm;
	configuration: EventConfigurationForm;

	[key: string]: AbstractControl;
}

export class EventForm extends FormGroup<IEventForm> {

	constructor() {
		super({
			_id: new FormControl(),
			note: new FormControl(),
			end: new FormControl(),
			start: new FormControl(),
			servicesAreProvidedInParallel: new FormControl(),
			services: new FormControl(),
			timeZone: new FormControl(),
			attendees: new AttendeesForm(),
			configuration: new EventConfigurationForm(),
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
		this.valueChanges.subscribe((value) => {
			const {services, start} = value;
			const [firstService] = services ?? [];
			if (!firstService || !start) {
				return;
			}
			const end = new Date(start);
			// TODO add to form new control to detect which duration version is selected
			const [firstDurationVersion] = firstService.durationVersions;
			const eventDurationInSeconds = (firstDurationVersion.durationInSeconds ?? 0) + (firstDurationVersion.breakInSeconds ?? 0);
			end.setSeconds(Number(new Date(start).getSeconds() + eventDurationInSeconds));
			this.controls.end.patchValue(end.toISOString(), {
				emitEvent: false,
				onlySelf: true,
			});
		});
	}

}
