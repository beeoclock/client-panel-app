import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {BooleanState} from "@utility/domain";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";

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
		NgIf
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
				<div #timeSlotsContainer class="grid grid-cols-3 md:grid-cols-6 gap-1 w-full">
					<button
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
export class SelectTimeComponent extends Reactive implements OnInit {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public localDateTimeControl!: FormControl<DateTime>;

  public selectedDateTime = DateTime.now();
  public currentIndexListOfSlots = 0;

  public readonly timeSlotLists: ITimeSlot[][] = [];
  public readonly amountOfDaySlotsInContainer = ONE_HOUR_IN_MINUTES / DEFAULT_INTERVAL_IN_MINUTES;

  @ViewChild('timeSlotsContainer')
  public timeSlotsContainer!: ElementRef<HTMLDivElement>;

  public readonly translateService = inject(TranslateService);
  public readonly slotsService = inject(SlotsService);

  public readonly loader = new BooleanState(true);

  public ngOnInit(): void {
    Settings.defaultLocale = this.translateService.currentLang;

    this.selectedDateTime = this.localDateTimeControl.value.set({
      hour: 7,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    this.control.valueChanges.pipe(this.takeUntil()).subscribe((VALUE) => {
      this.selectedDateTime = DateTime.fromISO(VALUE);
      this.localDateTimeControl.patchValue(this.selectedDateTime);
    });

    // Prepare datetime list
		this.prepareSlots(this.selectedDateTime).then(() => {
			this.loader.switchOff();
		});

    this.localDateTimeControl.valueChanges.subscribe((value) => {
			this.loader.switchOn();
			console.log(this.loader.isOn);
			this.prepareSlots(value).then(() => {
				this.loader.switchOff();
			});
    });
  }

	private async prepareSlots(target: DateTime): Promise<void> {
		const start = target.startOf('day').toUTC().toISO();
		const end = target.endOf('day').toUTC().toISO();
		if (start && end) {
			await this.slotsService.initSlots(start, end);

			const selectedDateTime = target.toUTC().toISO();
			if (selectedDateTime) {
				this.initTimeSlotLists(selectedDateTime);
			}
		}
	}

	/**
	 *
	 * @param selectedDateTime - ISO string
	 * @private
	 */
	private initTimeSlotLists(selectedDateTime: string): void {

		this.timeSlotLists.length = 0;

		let localTemporaryList: ITimeSlot[] = [];

		this.slotsService.getSlots()
			.map((slot) => ({
				isPast: DateTime.fromISO(slot).startOf('minute').toMillis() < DateTime.now().startOf('minute').toMillis(),
				datetime: DateTime.fromISO(slot)
			}))
			.forEach((slot, index) => {

				if (slot.datetime.toUTC().toISO() === selectedDateTime) {
					this.currentIndexListOfSlots = this.timeSlotLists.length;
				}

				localTemporaryList.push(slot);

				if (index !== 0 && !((index + 1) % this.amountOfDaySlotsInContainer)) {
					this.timeSlotLists.push(localTemporaryList);
					localTemporaryList = [];
				}

			});

	}

	public get isLastSlotPack(): boolean {
		return this.currentIndexListOfSlots === (this.timeSlotLists.length - 1);
	}

	public get isFirstSlotPack(): boolean {
		return this.currentIndexListOfSlots === 0;
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
