import {
	Component,
	ElementRef,
	inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChange,
	SimpleChanges,
	ViewChild
} from '@angular/core';
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
export class SelectTimeComponent extends Reactive implements OnInit, OnChanges {

	@Input({required: true})
	public control!: FormControl<string>;

	@Input({required: true})
	public specialist!: string;

	@Input({required: true})
	public eventDurationInSeconds!: number;

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

	public get loader(): BooleanStreamState {
		return this.slotsService.loader;
	}

	public ngOnChanges(changes: SimpleChanges & { specialist: SimpleChange }) {
		if (changes.specialist) {
			this.prepareSlots(this.localDateTimeControl.value).then();
		}
	}

	public ngOnInit(): void {
		Settings.defaultLocale = this.translateService.currentLang;

		this.selectedDateTime = this.localDateTimeControl.value.set({
			hour: 7,
			minute: 0,
			second: 0,
			millisecond: 0,
		});

		this.control.valueChanges.pipe(this.takeUntil()).subscribe((iso) => {
			this.selectedDateTime = DateTime.fromISO(iso);
			this.localDateTimeControl.patchValue(this.selectedDateTime);
		});

		// Prepare datetime list
		this.prepareSlots(this.selectedDateTime).then(() => {
			this.loader.switchOff();
		});

		this.localDateTimeControl.valueChanges.pipe(this.takeUntil()).subscribe((dateTime) => {
			this.logger.debug('localDateTimeControl.valueChanges', dateTime.toISO());
			this.loader.switchOn();
			this.prepareSlots(dateTime).then(() => {
				this.loader.switchOff();
			});
		});
	}

	private async prepareSlots(target: DateTime): Promise<void> {
		const today = DateTime.now();
		let start = target.startOf('day').toUTC().toISO();
		const end = target.endOf('day').toUTC().toISO();
		if (today.hasSame(target, 'day')) {
			const minutes = today.minute;
			const roundedMinutes = (+Math.floor((minutes / 10)).toFixed(0)) * 10;
			start = today.set({minute: roundedMinutes}).plus({minute: 10}).startOf('minute').toUTC().toISO();
		}
		if (start && end && this.specialist) {
			if (this.slotsService.inProgress.isOn) {
				return;
			}
			await this.slotsService.initSlots(start, end, this.specialist, this.eventDurationInSeconds);
			this.initTimeSlotLists();
		}
	}

	/**
	 *
	 * @private
	 */
	private initTimeSlotLists(): void {

		this.timeSlotLists.length = 0;
		this.currentIndexListOfSlots = 0;

		let localTemporaryList: ITimeSlot[] = [];

		const slots = this.slotsService.getSlots();

		if (!slots.length) {
			const nextDayISO = this.selectedDateTime.plus({day: 1}).toISO() ?? '';
			this.logger.debug(`nextDayISO: ${nextDayISO}`);
			this.control.patchValue(nextDayISO);
			return;
		}

		slots
			.map((slot) => ({
				isPast: DateTime.fromISO(slot).startOf('minute').toMillis() < DateTime.now().startOf('minute').toMillis(),
				datetime: DateTime.fromISO(slot)
			}))
			.forEach((slot, index) => {

				localTemporaryList.push(slot);

				if (index !== 0 && !((index + 1) % this.amountOfDaySlotsInContainer)) {
					this.timeSlotLists.push(localTemporaryList);
					localTemporaryList = [];
				}

			});

		if (localTemporaryList.length) {
			this.timeSlotLists.push(localTemporaryList);
		}


	}

	public get isLastSlotPack(): boolean {
		return this.timeSlotLists.length === 0 || this.currentIndexListOfSlots === (this.timeSlotLists.length - 1);
	}

	public get isFirstSlotPack(): boolean {
		return this.timeSlotLists.length === 0 || this.currentIndexListOfSlots === 0;
	}

	public prevSlotPack(): void {
		if ((this.currentIndexListOfSlots - 1) === -1) {
			return;
		}
		this.currentIndexListOfSlots = this.currentIndexListOfSlots - 1;
	}

	public nextSlotPack(): void {
		if ((this.currentIndexListOfSlots + 1) === this.timeSlotLists.length) {
			return;
		}
		this.currentIndexListOfSlots = this.currentIndexListOfSlots + 1;
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
	}

	public isSelected(datetime: DateTime): boolean {
		return datetime.hasSame(this.selectedDateTime, 'minute');
	}
}
