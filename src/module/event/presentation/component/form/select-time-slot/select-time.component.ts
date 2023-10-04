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
import {BooleanState} from "@utility/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {NGXLogger} from "ngx-logger";

export interface ITimeSlot {
  isPast: boolean;
  datetime: DateTime;
}

const ONE_HOUR_IN_MINUTES = 60;
const DEFAULT_INTERVAL_IN_MINUTES = 10;

@Component({
  selector: 'event-select-time-slot-time-form-component',
  standalone: true,
	imports: [
		NgForOf,
		NgClass,
		LoaderComponent,
		NgIf,
		TranslateModule
	],
  template: `
		<div class="flex items-center justify-between gap-1">
			<div *ngIf="loader.isOn" class="flex justify-center w-full">
				<utility-loader/>
			</div>
			<ng-template [ngIf]="loader.isOff">
				<button
					(click)="prevSlotPack()"
					[disabled]="isFirstSlotPack"
					type="button"
					class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl dark:text-white">
					<i class="bi bi-chevron-left"></i>
				</button>
				<ng-template [ngIf]="!timeSlotLists.length">
					{{ 'keyword.capitalize.dataNotFound' | translate }}
				</ng-template>
				<div #timeSlotsContainer *ngIf="timeSlotLists.length" class="grid grid-cols-3 md:grid-cols-6 gap-1 w-full">
					<button
						type="button"
						*ngFor="let timeSlot of timeSlotLists[currentIndexListOfSlots]"
						(click)="selectDateItem(timeSlot.datetime)"
						[ngClass]="getClassList(isSelected(timeSlot.datetime))"
						class="min-w-[72px] max-w-[72px] flex flex-col items-center justify-center border rounded-md px-3 py-2">
						<span>{{ timeSlot.datetime.toFormat('HH:mm') }}</span>
					</button>
				</div>
				<button
					(click)="nextSlotPack()"
					[disabled]="isLastSlotPack"
					type="button"
					class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl dark:text-white">
					<i class="bi bi-chevron-right"></i>
				</button>
			</ng-template>
		</div>
	`
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

  public readonly loader = new BooleanState(true);

	public ngOnChanges(changes: SimpleChanges & {specialist: SimpleChange}) {
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
