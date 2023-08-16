import {ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";

export interface ITimeSlot {
  isPast: boolean;
  datetime: DateTime;
}

@Component({
  selector: 'event-select-time-slot-time-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  template: `
    <div class="flex items-center justify-between gap-1">
      <button (click)="prevSlotPack()"
              class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl dark:text-white">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div #timeSlotsContainer class="grid grid-cols-3 md:grid-cols-6 gap-1 w-full">
        <button
          *ngFor="let timeSlot of timeSlotList"
          (click)="selectDateItem(timeSlot.datetime)"
          [ngClass]="getClassList(isSelected(timeSlot.datetime))"
          class="min-w-[72px] max-w-[72px] flex flex-col items-center justify-center border rounded-md px-3 py-2">
          <span>{{ timeSlot.datetime.toFormat('HH:mm') }}</span>
        </button>
      </div>
      <button (click)="nextSlotPack()"
              class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl dark:text-white">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  `
})
export class SelectTimeComponent extends Reactive implements OnInit {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public localDateTimeControl!: FormControl<DateTime>;

  public selectedDateTime = DateTime.now();

  public timeSlotList: ITimeSlot[] = [];
  public amountOfDaySlotsInContainer = 6;

  @ViewChild('timeSlotsContainer')
  public timeSlotsContainer!: ElementRef<HTMLDivElement>;

  public readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly translateService = inject(TranslateService);

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
      this.changeDetectorRef.detectChanges();
    });

    // Prepare datetime list
    this.generateTimeSlots(this.selectedDateTime);

    this.localDateTimeControl.valueChanges.subscribe((value) => {
      if (value.hasSame(this.selectedDateTime, 'day')) {
        this.generateTimeSlots(this.selectedDateTime);
      } else {
        this.generateTimeSlots(value.set({
          hour: 7
        }));
      }
    });
  }

  public prevSlotPack(): void {
    this.generateTimeSlots(this.timeSlotList[0].datetime.minus({
      hours: 1
    }));

  }

  public nextSlotPack(): void {
    const item = this.timeSlotList.at(-1);
    if (item) {
      this.generateTimeSlots(item.datetime.plus({
        minute: 10
      }));
    }

  }

  public generateTimeSlot(sourceDatetime: DateTime, time: number): ITimeSlot {
    // TODO performance
    const datetime = sourceDatetime.plus({
      minutes: 10 * time
    });

    return {
      isPast: datetime.startOf('minute').toMillis() < DateTime.now().startOf('minute').toMillis(),
      datetime
    };
  }

  public generateTimeSlots(sourceDatetime: DateTime): void {
    this.timeSlotList = [];
    sourceDatetime = sourceDatetime.setLocale(this.translateService.currentLang);
    sourceDatetime = sourceDatetime.set({
      minute: 0,
      second: 0,
    });
    for (let time = 0; time < this.amountOfDaySlotsInContainer; time++) {
      this.timeSlotList.push(this.generateTimeSlot(sourceDatetime, time));
    }
    this.changeDetectorRef.detectChanges();
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
