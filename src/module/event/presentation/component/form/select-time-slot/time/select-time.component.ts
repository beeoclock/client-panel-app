import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {NGXLogger} from "ngx-logger";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ButtonArrowComponent} from "@event/presentation/component/form/select-time-slot/button.arrow.component";
import {debounceTime} from "rxjs";
import {MS_QUARTER_SECOND} from "@utility/domain/const/c.time";
import {BooleanState} from "@utility/domain";

export interface ITimeSlot {
	isPast: boolean;
	datetime: DateTime;
}

const ONE_HOUR_IN_MINUTES = 60;
const DEFAULT_INTERVAL_IN_MINUTES = 10;

@Component({
	selector: 'event-select-time-slot-time-form-component',
	standalone: true,
	templateUrl: './select-time.component.html',
	imports: [
		NgForOf,
		NgClass,
		LoaderComponent,
		NgIf,
		TranslateModule,
		ButtonArrowComponent
	],
})
export class SelectTimeComponent extends Reactive implements OnInit {

	@Input({required: true})
	public control!: FormControl<string>;

	@Input({required: true})
	public localDateTimeControl!: FormControl<DateTime>;

	public selectedDateTime = DateTime.now();
	public currentIndexListOfSlots = 0;

	public readonly timeSlotLists: ITimeSlot[][] = [];
	public readonly amountOfDaySlotsInContainer = ONE_HOUR_IN_MINUTES / DEFAULT_INTERVAL_IN_MINUTES;

	@ViewChild('timeSlotsContainer')
	public timeSlotsContainer!: ElementRef<HTMLDivElement>;

	public readonly logger = inject(NGXLogger);
	public readonly translateService = inject(TranslateService);
	public readonly slotsService = inject(SlotsService);

	private readonly firstAccessibleSlotIsInitialized = new BooleanState(false);

	public slots: {
		start: DateTime;
		end: DateTime;
	}[] = [];

	public get loader(): BooleanStreamState {
		return this.slotsService.loader;
	}

	public ngOnInit(): void {
		Settings.defaultLocale = this.translateService.currentLang;

		// Set component into slots.service
		this.slotsService.selectTimeComponent = this;

		this.control.valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe((iso) => {
			this.selectedDateTime = DateTime.fromISO(iso);
			this.localDateTimeControl.patchValue(this.selectedDateTime);
			this.slots = this.slotsService.getSlotsByDay(this.selectedDateTime);
		});

		// Prepare datetime list
		if (this.control.value) {
			this.selectedDateTime = DateTime.fromISO(this.control.value);
			this.localDateTimeControl.patchValue(this.selectedDateTime);
		}

		this.localDateTimeControl.valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe((dateTime) => {
			this.logger.debug('localDateTimeControl.valueChanges', dateTime.toISO());
			this.slots = this.slotsService.getSlotsByDay(dateTime);
		});
	}

	public getClassList(isSelected: boolean): string[] {
		if (isSelected) {
			return ['bg-blue-100', 'text-blue-600', 'border-blue-200'];
		}
		return ['hover:bg-beeColor-100', 'hover:text-black', 'dark:text-beeColor-500'];
	}

	public selectDateItem(datetime: DateTime): void {
		this.selectedDateTime = datetime;
		this.control.patchValue(datetime.toUTC().toISO() as string);
		this.localDateTimeControl.patchValue(datetime, {
			emitEvent: false,
			onlySelf: true
		});
	}

	public isSelected(datetime: DateTime): boolean {
		return datetime.hasSame(this.selectedDateTime, 'minute');
	}
}
