import {ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'event-select-time-slot-time-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  template: `
    <div class="flex items-center justify-between gap-1">
      <button (click)="prevSlotPack()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div #timeSlotsContainer class="grid grid-cols-3 md:grid-cols-6 gap-1 w-full">
        <button
          *ngFor="let timeSlot of timeSlotList"
          (click)="selectDateItem(timeSlot.datetime)"
          [ngClass]="getClassList(isSelected(timeSlot.datetime))"
          class="min-w-[72px] max-w-[72px] flex flex-col items-center justify-center border rounded-xl px-3 py-2">
          <span>{{ timeSlot.datetime.toFormat('HH:mm') }}</span>
        </button>
      </div>
      <button (click)="nextSlotPack()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  `
})
export class SelectTimeComponent implements OnInit {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public localDateTimeControl!: FormControl<DateTime>;

  public selectedDateTime = DateTime.now();

  public timeSlotList: { isPast: boolean; datetime: DateTime; }[] = [];
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
    });

    // Prepare datetime list
    this.prepareDatetimeList(this.selectedDateTime);

    this.localDateTimeControl.valueChanges.subscribe((value) => {
      if (value.hasSame(this.selectedDateTime, 'day')) {
        this.prepareDatetimeList(this.selectedDateTime);
      } else {
        this.prepareDatetimeList(value.set({
          hour: 7
        }));
      }
    });

  }

  public prevSlotPack(): void {
    this.prepareDatetimeList(this.timeSlotList[0].datetime.minus({
      hours: 1
    }));

  }

  public nextSlotPack(): void {
    const item = this.timeSlotList.at(-1);
    if (item) {
      this.prepareDatetimeList(item.datetime.plus({
        minute: 10
      }));
    }

  }

  private prepareDatetimeList(sourceDatetime: DateTime): void {
    this.timeSlotList = [];
    sourceDatetime = sourceDatetime.setLocale(this.translateService.currentLang);
    sourceDatetime = sourceDatetime.set({
      minute: 0,
      second: 0,
    });
    for (let time = 0; time < this.amountOfDaySlotsInContainer; time++) {
      const datetime = sourceDatetime.plus({
        minute: 10 * time
      });
      // TODO performance
      this.timeSlotList.push({
        isPast: (datetime.startOf('minute').toISODate() as string) < (DateTime.now().startOf('minute').toISODate() as string),
        datetime
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  /**
   *
   * @param isSelected
   */
  public getClassList(isSelected: boolean): string[] {
    if (isSelected) {
      return ['bg-blue-100', 'text-blue-600', 'border-blue-200'];
    }
    return ['hover:bg-gray-100', 'hover:text-black'];
  }

  /**
   *
   * @param datetime
   */
  public selectDateItem(datetime: DateTime): void {
    this.selectedDateTime = datetime;
    this.control.patchValue(datetime.toISO() as string);
  }

  /**
   *
   * @param datetime
   */
  public isSelected(datetime: DateTime): boolean {
    return datetime.hasSame(this.selectedDateTime, 'minute');
  }
}
