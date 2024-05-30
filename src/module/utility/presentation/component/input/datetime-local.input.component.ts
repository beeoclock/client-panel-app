import {Component, inject, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {InputIconComponent} from "@utility/presentation/component/input/input-icon.component";
import {InputBadgeComponent} from "@utility/presentation/component/input/input-badge.component";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {NGXLogger} from "ngx-logger";
import {Reactive} from "@utility/cdk/reactive";
import {filter, startWith} from "rxjs";
import {is} from "thiis";
import {DateTime} from "luxon";

@Component({
	selector: 'datetime-local-input-component',
	standalone: true,
	imports: [
		InputIconComponent,
		InputBadgeComponent,
		TranslateModule,
		FormInputComponent,
	],
	template: `
		<form-input
			[id]="id"
			[showLabel]="showLabel"
			[label]="label"
			[control]="localControl"
			[additionalClassList]="additionalClassList"
			placeholder="00.00.000 00:00:00"
			inputType="datetime-local">
			<ng-content/>
		</form-input>
	`
})
export class DatetimeLocalInputComponent extends Reactive implements OnInit {

	@Input({required: true})
	public control!: FormControl;

	public readonly localControl = new FormControl<string | null>(null);

	@Input()
	public label = '';

	@Input()
	public id = '';

	@Input()
	public customClassList: string = '';

	@Input()
	public additionalClassList: string = '';

	@Input()
	public showLabel = true;

	private readonly ngxLogger = inject(NGXLogger);

	private previousValue: string | null = null;

	public ngOnInit(): void {

		this.localControl.valueChanges.pipe(
			startWith(this.localControl.value),
			this.takeUntil(),
			filter(is.string),
		).subscribe((localValue) => {
			const {value: controlValue} = this.control;
			this.detectChanges(localValue, controlValue);
		});

		this.control.valueChanges.pipe(
			startWith(this.control.value),
			this.takeUntil(),
			filter(is.string),
		).subscribe((controlValue) => {
			const {value: localValue} = this.localControl;
			this.detectChanges(localValue, controlValue);
		});

		// Errors
		this.localControl.setErrors(this.control.errors);
		this.control.statusChanges.subscribe(() => {
			this.localControl.setErrors(this.control.errors);
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
			if (controlValue) {
				this.previousValue = controlValue;
				this.initLocalControlValue();
			}
			if (localValue) {
				this.previousValue = localValue;
				this.initControlValue();
			}
		} else {
			// Update
			if (controlValue !== this.previousValue) {
				this.previousValue = controlValue;
				this.initLocalControlValue();
			}
			if (localValue !== this.previousValue) {
				this.previousValue = localValue;
				this.initControlValue();
			}
		}
	}

	private initLocalControlValue() {

		// Convert into datetime-local format
		const date = DateTime.fromISO(this.control.value);
		const localControlStartValue = date.toISO();
		localControlStartValue && this.localControl.patchValue(localControlStartValue.substring(0, 16), {
			emitEvent: false,
			onlySelf: true
		});

	}

	private initControlValue() {

		const {value} = this.control;
		this.ngxLogger.debug('DatetimeLocalInputComponent', 'valueChanges', this.control);
		if (!value) {
			return;
		}
		const date = new Date(value);
		this.control.patchValue(date.toISOString(), {
			emitEvent: false,
			onlySelf: true
		});

	}

}
