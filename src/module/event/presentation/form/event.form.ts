import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

import {AttendeesForm} from "@event/presentation/form/attendant.form";
import {EventConfigurationForm} from "@event/presentation/form/configuration.form";
import {LanguageCodeEnum} from "@utility/domain/enum";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {ISpecialist} from "@src/core/business-logic/service/interface/i.specialist";


export interface IEventForm {
	_id: FormControl<string>;
	servicesAreProvidedInParallel: FormControl<boolean>;
	services: FormControl<IServiceDto[]>;
	language: FormControl<LanguageCodeEnum>;
	note: FormControl<string>;
	start: FormControl<string>;
	end: FormControl<string>;
	timeZone: FormControl<string>;
	specialists: FormControl<ISpecialist[]>;
	attendees: AttendeesForm;
	configuration: EventConfigurationForm;

	[key: string]: AbstractControl;
}

export class EventForm extends FormGroup<IEventForm> {

	private readonly destroy$ = new Subject<void>();

	constructor() {
		super({
			_id: new FormControl(),
			note: new FormControl(),
			end: new FormControl(),
			start: new FormControl(),
			servicesAreProvidedInParallel: new FormControl(false, {
				nonNullable: true,
			}),
			services: new FormControl(),
			language: new FormControl(),
			specialists: new FormControl([] as ISpecialist[], {
				nonNullable: true,
			}),
			timeZone: new FormControl(Intl.DateTimeFormat().resolvedOptions().timeZone, {
				nonNullable: true,
			}),
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
	}

	public initHandler(): void {
		this.valueChanges.pipe(
			takeUntil(this.destroy$),
		).subscribe((value) => {
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

	public destroyHandlers(): void {

		this.destroy$.next();
		this.destroy$.complete();

	}

}
