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
export class SelectTimeComponent extends Reactive implements OnInit, OnChanges {

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

		// Set component into slots.service
		this.slotsService.selectTimeComponent = this;

		this.control.valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe((iso) => {
			this.selectedDateTime = DateTime.fromISO(iso);
			this.localDateTimeControl.patchValue(this.selectedDateTime);
		});

		// Prepare datetime list
		if (this.control.value) {
			this.selectedDateTime = DateTime.fromISO(this.control.value);
			this.prepareSlots(this.selectedDateTime).then();
		} else {
			this.prepareSlots(DateTime.now()).then();
		}

		this.localDateTimeControl.valueChanges.pipe(
			this.takeUntil(),
			debounceTime(MS_QUARTER_SECOND),
		).subscribe(async (dateTime) => {
			this.logger.debug('localDateTimeControl.valueChanges', dateTime.toISO());
			await this.prepareSlots(dateTime);
		});
	}

	private async prepareSlots(target: DateTime): Promise<void> {

		this.logger.debug('prepareSlots', target.toISO());

		this.loader.switchOn();

		const start = target.startOf('day').toUTC().toISO();
		const end = target.plus({day: 7}).endOf('day').toUTC().toISO();

		if (start && end) {

			await this.slotsService.initSlots(start, end);
			this.initTimeSlotLists();

		}

		this.loader.switchOff();
	}

	/**
	 *
	 * @private
	 */
	public initTimeSlotLists(): void {

		this.timeSlotLists.length = 0;
		this.currentIndexListOfSlots = 0;

		let localTemporaryList: ITimeSlot[] = [];

		let startOfSelectedDate = this.localDateTimeControl.value.startOf('day');
		const endOfSelectedDateISO = this.localDateTimeControl.value.endOf('day').toUTC().toISO() ?? '';

		const today = DateTime.now();
		if (today.hasSame(startOfSelectedDate, 'day')) {

			const minutes = today.minute;
			const roundedMinutes = (+Math.floor((minutes / 10)).toFixed(0)) * 10;
			startOfSelectedDate = today.set({minute: roundedMinutes}).plus({minute: 10}).startOf('minute');

		}

		const startOfSelectedDateISO = startOfSelectedDate.toUTC().toISO() ?? '';

		const slots = this.slotsService.slots.filter((slot) => slot > startOfSelectedDateISO && slot < endOfSelectedDateISO);

		if (!slots.length && this.firstAccessibleSlotIsInitialized.isOff) {
			this.firstAccessibleSlotIsInitialized.switchOn();
			const [firstSlot] = this.slotsService.slots;
			this.logger.debug(`nextDayISO: ${firstSlot}`);
			this.control.patchValue(firstSlot);
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
					// Detect selected index
					if (localTemporaryList.some((item) => item.datetime.hasSame(this.selectedDateTime, 'minute'))) {
						this.currentIndexListOfSlots = this.timeSlotLists.length - 1;
					}
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
		this.localDateTimeControl.patchValue(datetime, {
			emitEvent: false,
			onlySelf: true
		});
	}

	public isSelected(datetime: DateTime): boolean {
		return datetime.hasSame(this.selectedDateTime, 'minute');
	}
}
