import {Component, ElementRef, inject, input, OnInit, viewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass} from "@angular/common";
import {Reactive} from "@core/cdk/reactive";
import {SlotsService} from "@tenant/event/presentation/ui/component/form/select-time-slot/slots.service";
import {LoaderComponent} from "@shared/presentation/component/loader/loader.component";
import {NGXLogger} from "ngx-logger";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {debounceTime, filter} from "rxjs";
import {MS_QUARTER_SECOND} from "@shared/domain/const/c.time";
import {EventConfigurationForm} from "@tenant/event/presentation/form/configuration.form";
import {DatetimeLocalInputComponent} from "@shared/presentation/component/input/datetime-local.input.component";
import {is} from "@core/shared/checker";

export interface ITimeSlot {
	isPast: boolean;
	datetime: DateTime;
}

enum PeriodOfDayEnum {
	NIGHT = 'NIGHT',
	MORNING = 'MORNING',
	AFTERNOON = 'AFTERNOON',
	EVENING = 'EVENING',
}

enum IndexOfPeriodOfDayEnum {
	NIGHT = 0,
	MORNING = 1,
	AFTERNOON = 2,
	EVENING = 3,
}

@Component({
	selector: 'event-select-time-slot-time-form-component',
	standalone: true,
	templateUrl: './select-time.component.html',
	imports: [
		NgClass,
		LoaderComponent,
		TranslateModule,
		DatetimeLocalInputComponent,
	],
})
export class SelectTimeComponent extends Reactive implements OnInit {

	public readonly control = input.required<FormControl<string>>();

	public readonly configurationForm = input.required<EventConfigurationForm>();

	public readonly localDateTimeControl = input.required<FormControl<DateTime | null>>();

	public selectedDateTime: DateTime = DateTime.now();

	readonly timeSlotsContainer = viewChild.required<ElementRef<HTMLDivElement>>('timeSlotsContainer');

	public readonly logger = inject(NGXLogger);
	public readonly translateService = inject(TranslateService);
	public readonly slotsService = inject(SlotsService);

	public readonly ownOptionOfStartTimeControl = new FormControl<string | null>(null);

	public groupedSlots: {
		periodOfDay: PeriodOfDayEnum;
		slots: { start: DateTime; end: DateTime }[];
	}[] = [];

	public get loader(): BooleanStreamState {
		return this.slotsService.loader;
	}

	public ngOnInit(): void {
		Settings.defaultLocale = this.translateService.currentLang;

		// Set component into slots.service
		this.slotsService.selectTimeComponent = this;

		this.control().valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe((iso) => {
			this.selectedDateTime = DateTime.fromISO(iso);
			this.localDateTimeControl().patchValue(this.selectedDateTime);
			const slots = this.slotsService.getSlotsByDay(this.selectedDateTime);
			this.groupedSlots = this.groupSlots(slots);
		});

		// Prepare datetime list
		const control = this.control();
		if (control.value) {
			this.selectedDateTime = DateTime.fromISO(control.value);
			this.localDateTimeControl().patchValue(this.selectedDateTime);
		}

		this.localDateTimeControl().valueChanges.pipe(
			this.takeUntil(),
			filter(is.not_null<DateTime>),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe((dateTime) => {
			this.logger.debug('localDateTimeControl.valueChanges', dateTime.toISO());
			const slots = this.slotsService.getSlotsByDay(dateTime);
			this.groupedSlots = this.groupSlots(slots);
		});

		this.ownOptionOfStartTimeControl.valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe((value) => {
			if (value) {
				const datetime = DateTime.fromISO(value);
				this.selectedDateTime = datetime;
				this.control().patchValue(datetime.toUTC().toISO() as string);
			}
		});

		if (control.value) {
			this.ownOptionOfStartTimeControl.patchValue(control.value);
		}

	}

	public getClassList(isSelected: boolean): string[] {
		if (isSelected) {
			return ['bg-blue-100', 'text-blue-600', 'border-blue-200'];
		}
		return ['hover:bg-beeColor-100', 'hover:text-black', 'dark:text-beeColor-500'];
	}

	public ignoreEventChecks(value: boolean): void {
		this.configurationForm().controls.ignoreEventChecks.patchValue(value);
	}

	public selectDateItem(datetime: DateTime, ignoreEventChecks = false): void {
		this.ignoreEventChecks(ignoreEventChecks);
		this.selectedDateTime = datetime;
		this.control().patchValue(datetime.toUTC().toISO() as string);
		this.localDateTimeControl().patchValue(datetime, {
			emitEvent: false,
			onlySelf: true
		});
	}

	public isSelected(datetime: DateTime): boolean {
		return datetime.hasSame(this.selectedDateTime, 'minute');
	}

	private groupSlots(slots: { start: DateTime; end: DateTime }[]) {
		const groupedSlots: {
			periodOfDay: PeriodOfDayEnum;
			slots: { start: DateTime; end: DateTime }[];
		}[] = [{
			periodOfDay: PeriodOfDayEnum.NIGHT,
			slots: []
		}, {
			periodOfDay: PeriodOfDayEnum.MORNING,
			slots: []
		}, {
			periodOfDay: PeriodOfDayEnum.AFTERNOON,
			slots: []
		}, {
			periodOfDay: PeriodOfDayEnum.EVENING,
			slots: []
		}];
		slots.forEach((slot) => {
			const periodOfDay = this.getPeriodOfDay(slot.start);
			const index = this.getIndexOfPeriodOfDay(periodOfDay);
			groupedSlots[index].periodOfDay = periodOfDay;
			groupedSlots[index].slots.push(slot);
		});
		return groupedSlots;
	}

	private getPeriodOfDay(start: DateTime) {
		const hour = start.hour;
		// 24 format
		if (hour >= 0 && hour < 6) {
			return PeriodOfDayEnum.NIGHT;
		} else if (hour >= 6 && hour < 12) {
			return PeriodOfDayEnum.MORNING;
		} else if (hour >= 12 && hour < 18) {
			return PeriodOfDayEnum.AFTERNOON;
		}
		return PeriodOfDayEnum.EVENING;
	}

	private getIndexOfPeriodOfDay(periodOfDay: PeriodOfDayEnum) {
		switch (periodOfDay) {
			case PeriodOfDayEnum.NIGHT:
				return IndexOfPeriodOfDayEnum.NIGHT;
			case PeriodOfDayEnum.MORNING:
				return IndexOfPeriodOfDayEnum.MORNING;
			case PeriodOfDayEnum.AFTERNOON:
				return IndexOfPeriodOfDayEnum.AFTERNOON;
			case PeriodOfDayEnum.EVENING:
				return IndexOfPeriodOfDayEnum.EVENING;
		}
	}
}
