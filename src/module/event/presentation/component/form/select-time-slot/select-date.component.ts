import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";

function hasScrollbar(element: HTMLElement) {
  if (!element) return false;
  return (
    element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight
  );
}

@Component({
  selector: 'event-select-time-slot-date-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    TranslateModule
  ],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-center gap-3">
        <span class="text-2xl font-medium">
        {{ daySlotsTitle }}
      </span>
      </div>
      <div class="flex items-center justify-between gap-1">
        <button (click)="prevPackOfDates()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div #daySlotsContainer class="flex gap-1 overflow-x-auto w-full justify-center items-center">
          <div *ngFor="let dayItem of dayItemList" class="relative pb-0.5 pt-1">
            <span *ngIf="dayItem.isToday" class="w-[10px] h-[10px] rounded-full absolute left-[25px] -top-0" [class.bg-blue-200]="isSelected(dayItem.datetime)" [class.bg-gray-300]="!isSelected(dayItem.datetime)"></span>

            <button
              (click)="selectDateItem(dayItem.datetime)"
              [ngClass]="getClassList(isSelected(dayItem.datetime))"
              [disabled]="dayItem.isPast"
              [class.opacity-50]="dayItem.isPast"
              class="min-w-[60px] max-w-[60px] min-h-[60px] max-h-[60px] leading-tight flex flex-col items-center justify-center ring-1 ring-inset rounded-xl p-3">
              <span class="font-bold">{{ dayItem.datetime.day }}</span>
              <span>{{ dayItem.datetime.weekdayShort }}</span>
            </button>
            <span *ngIf="hasSelectedTimeSlot(dayItem.datetime)" class="w-[30px] h-[6px] rounded-full absolute left-[15px] -bottom-0" [class.bg-blue-200]="isSelected(dayItem.datetime)" [class.bg-gray-300]="!isSelected(dayItem.datetime)"></span>
          </div>
        </div>
        <button (click)="nextPackOfDates()" class="px-3 py-2 hover:bg-gray-300 cursor-pointer rounded-2xl">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  `
})
export class SelectDateComponent implements OnInit, AfterViewInit {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public localDateTimeControl!: FormControl<DateTime>;

  public selectedDateTime = DateTime.now();
  public today = DateTime.now();

  public dayItemList: { isPast: boolean; isToday: boolean; isTomorrow: boolean; datetime: DateTime; }[] = [];
  public amountOfDaySlotsInContainer = 0;

  @ViewChild('daySlotsContainer')
  public daySlotsContainer!: ElementRef<HTMLDivElement>;

  public readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly translateService = inject(TranslateService);

  public daySlotsTitle = '';

  public ngOnInit(): void {

    Settings.defaultLocale = this.translateService.currentLang;

    this.control.valueChanges.subscribe((value) => {
      this.changeDetectorRef.detectChanges();
    });

  }

  public ngAfterViewInit(): void {

    // TODO use code in console.log to detect how many day slots can be represent in present view!
    console.log(hasScrollbar(this.daySlotsContainer.nativeElement));

    // Detect amount of day slots
    this.amountOfDaySlotsInContainer = Math.floor(this.daySlotsContainer.nativeElement.clientWidth / (60 + 6));

    // Prepare datetime list
    this.prepareDatetimeList(this.today);

  }

  public prevPackOfDates(): void {
    this.prepareDatetimeList(this.dayItemList[0].datetime.minus({
      day: this.amountOfDaySlotsInContainer
    }));
  }

  public nextPackOfDates(): void {
    const item = this.dayItemList.at(-1);
    if (item) {
      this.prepareDatetimeList(item.datetime.plus({
        day: 1
      }));
    }
  }

  public prepareDaySlotsTitle(sourceDatetime: DateTime): void {
    const nextLocalDateTime = sourceDatetime.plus({
      day: this.amountOfDaySlotsInContainer
    });
    let text = sourceDatetime.toFormat('LLLL');
    if (!nextLocalDateTime.hasSame(sourceDatetime, 'month')) {
      if (nextLocalDateTime.hasSame(sourceDatetime, 'year')) {
        text += ` - ${nextLocalDateTime.toFormat('LLLL')}`;
      } else {
        text += ` ${sourceDatetime.toFormat('yyyy')} - ${nextLocalDateTime.toFormat('LLLL yyyy')}`;
      }
    }
    this.daySlotsTitle = text;
  }

  private prepareDatetimeList(sourceDatetime: DateTime): void {
    this.dayItemList = [];
    sourceDatetime = sourceDatetime.setLocale(this.translateService.currentLang);
    for (let day = 0; day < this.amountOfDaySlotsInContainer; day++) {
      const datetime = sourceDatetime.plus({
        day
      });
      // TODO performance
      this.dayItemList.push({
        isPast: (datetime.startOf('day').toISODate() as string) < (DateTime.now().startOf('day').toISODate() as string),
        isToday: datetime.hasSame(this.today, 'day'),
        isTomorrow: datetime.hasSame(this.today.plus({day: 1}), 'day'),
        datetime
      });
    }
    this.prepareDaySlotsTitle(sourceDatetime);
    this.changeDetectorRef.detectChanges()
  }

  /**
   *
   * @param datetime
   */
  public selectDateItem(datetime: DateTime): void {
    this.selectedDateTime = datetime;
    this.localDateTimeControl.patchValue(datetime);
  }

  /**
   *
   * @param datetime
   */
  public isSelected(datetime: DateTime): boolean {
    return datetime.hasSame(this.selectedDateTime, 'day');
  }

  public hasSelectedTimeSlot(datetime: DateTime): boolean {
    return DateTime.fromISO(this.control.value).hasSame(datetime, 'day');
  }

  /**
   *
   * @param isSelected
   */
  public getClassList(isSelected: boolean): string[] {
    if (isSelected) {
      return ['bg-blue-100', 'text-blue-600', 'ring-blue-200'];
    }
    return ['text-gray-500', 'hover:bg-gray-100', 'hover:text-black', 'ring-gray-300'];
  }
}
