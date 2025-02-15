import {Component, inject, input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {filter, startWith} from "rxjs";
import {is} from "@src/core/shared/checker";
import {DateTime} from "luxon";

@Component({
	selector: 'datetime-local-input-component',
	standalone: true,
	imports: [
		TranslateModule,
		FormInputComponent,
	],
	template: `
		<form-input
			[id]="id()"
			[label]="label()"
			[control]="localControl"
			placeholder="00.00.000 00:00:00"
			inputType="datetime-local">
			<ng-content/>
		</form-input>
	`
})
export class DatetimeLocalInputComponent extends Reactive implements OnInit {

	public readonly control = input.required<FormControl>();

	public readonly localControl = new FormControl<string | null>(null);

	public readonly label = input('');

	public readonly id = input('');

	private readonly ngxLogger = inject(NGXLogger);

	private previousValue: string | null = null;

	public ngOnInit(): void {

		this.localControl.valueChanges.pipe(
			startWith(this.localControl.value),
			this.takeUntil(),
			filter(is.string),
		).subscribe((localValue) => {
			const {value: controlValue} = this.control();
			this.detectChanges(localValue, controlValue);
		});

		this.control().valueChanges.pipe(
			startWith(this.control().value),
			this.takeUntil(),
			filter(is.string),
		).subscribe((controlValue) => {
			const {value: localValue} = this.localControl;
			this.detectChanges(localValue, controlValue);
		});

		// Errors
		const control = this.control();
  this.localControl.setErrors(control.errors);
		control.statusChanges.subscribe(() => {
			this.localControl.setErrors(this.control().errors);
		})

	}

	private detectChanges(localValue: string | null, controlValue: string | null) {

		this.ngxLogger.debug('DatetimeLocalInputComponent', 'detectChanges', {
			localValue,
			controlValue,
			previousValue: this.previousValue
		});

		if (controlValue === localValue) {
			return;
		}

		if (is.null(this.previousValue)) {
			// First time
			if (localValue) {
				this.previousValue = localValue;
				this.initControlValue();
			}
			if (controlValue) {
				this.previousValue = controlValue;
				this.initLocalControlValue();
			}
		} else {
			// Update
			if (localValue !== this.previousValue) {
				this.previousValue = localValue;
				this.initControlValue();
			}
			if (controlValue !== this.previousValue) {
				this.previousValue = controlValue;
				this.initLocalControlValue();
			}
		}
	}

	private initLocalControlValue() {

		const {value} = this.control();
		this.ngxLogger.debug('DatetimeLocalInputComponent', 'initLocalControlValue', this.control());

		// Convert into datetime-local format
		const date = DateTime.fromISO(value);
		const localControlStartValue = date.toISO();
		localControlStartValue && this.localControl.patchValue(localControlStartValue.substring(0, 16), {
			emitEvent: false,
			onlySelf: true
		});

	}

	private initControlValue() {

		const {value} = this.localControl;
		this.ngxLogger.debug('DatetimeLocalInputComponent', 'initControlValue', this.localControl);
		if (!value) {
			return;
		}
		const date = new Date(value);
		this.control().patchValue(date.toISOString(), {
			emitEvent: false,
			onlySelf: true
		});

	}

}
