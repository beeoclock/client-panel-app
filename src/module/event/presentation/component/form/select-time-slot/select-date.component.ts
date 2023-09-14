import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";

// TODO Move
function hasScrollbar(element: HTMLElement) {
  if (!element) return false;
  return (
    element.scrollWidth > element.clientWidth ||
    element.scrollHeight > element.clientHeight
  );
}

// TODO Move
interface IDayItem {
  isPast: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  datetime: DateTime;
}

// TODO Move
// Helper function to generate a list of day items
export function generateDayItemList(sourceDatetime: DateTime, amountOfDaySlotsInContainer: number) {
  const dayItemList = [];
  for (let day = 0; day < amountOfDaySlotsInContainer; day++) {
    const datetime = sourceDatetime.plus({day});
    dayItemList.push({
      isPast: datetime.startOf('day') < DateTime.now().startOf('day'),
      isToday: datetime.hasSame(DateTime.now(), 'day'),
      isTomorrow: datetime.hasSame(DateTime.now().plus({day: 1}), 'day'),
      datetime,
    });
  }
  return dayItemList;
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
    <div class="flex flex-col gap-3 dark:text-white">
      <!-- Day Slots Title -->
      <div class="flex items-center justify-center gap-3">
        <span class="text-2xl font-medium">{{ daySlotsTitle }}</span>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex items-center justify-between gap-1">
        <button type="button" (click)="prevPackOfDates()" class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl">
          <i class="bi bi-chevron-left"></i>
        </button>

        <!-- Day Slots Container -->
        <div #daySlotsContainer class="flex gap-1 overflow-x-auto w-full justify-center items-center">
          <ng-container *ngFor="let dayItem of dayItemList">
            <div class="relative pb-0.5 pt-1">
            <span
              *ngIf="dayItem.isToday"
              class="w-[10px] h-[10px] rounded-full absolute left-[25px] -top-0"
              [ngClass]="{
                'bg-blue-200': isSelected(dayItem.datetime),
                'bg-beeColor-300': !isSelected(dayItem.datetime)
                }">
            </span>

              <button
                (click)="selectDateItem(dayItem.datetime)"
                [ngClass]="getClassList(isSelected(dayItem.datetime))"
                [disabled]="dayItem.isPast"
                class="min-w-[60px] max-w-[60px] min-h-[60px] max-h-[60px] leading-tight flex flex-col items-center justify-center ring-1 ring-inset rounded-md p-3">
                <span class="font-bold">{{ dayItem.datetime.day }}</span>
                <span>{{ dayItem.datetime.weekdayShort }}</span>
              </button>

              <span
                *ngIf="hasSelectedTimeSlot(dayItem.datetime)"
                class="w-[30px] h-[6px] rounded-full absolute left-[15px] -bottom-0"
                [ngClass]="{ 'bg-blue-200': isSelected(dayItem.datetime), 'bg-beeColor-300': !isSelected(dayItem.datetime) }"
              ></span>
            </div>
          </ng-container>
        </div>

        <button type="button" (click)="nextPackOfDates()" class="px-3 py-2 hover:bg-beeColor-300 dark:hover:bg-beeDarkColor-800 cursor-pointer rounded-2xl">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

  `
})
export class SelectDateComponent extends Reactive implements OnInit, AfterViewInit {

  @Input()
  public control!: FormControl<string>;

  @Input()
  public localDateTimeControl!: FormControl<DateTime>;

  public selectedDateTime = DateTime.now();
  public today = DateTime.now();

  public dayItemList: IDayItem[] = [];
  public amountOfDaySlotsInContainer = 0;

  @ViewChild('daySlotsContainer')
  public daySlotsContainer!: ElementRef<HTMLDivElement>;

  public readonly changeDetectorRef = inject(ChangeDetectorRef);
  public readonly translateService = inject(TranslateService);

  public daySlotsTitle = '';

  public ngOnInit(): void {

    Settings.defaultLocale = this.translateService.currentLang;

    this.control.valueChanges.pipe(this.takeUntil()).subscribe((VALUE) => {
      this.selectedDateTime = DateTime.fromISO(VALUE);
      this.localDateTimeControl.patchValue(this.selectedDateTime);
      this.changeDetectorRef.detectChanges();
    });

  }

  public ngAfterViewInit(): void {
    this.detectAmountOfDaySlots();
    this.prepareDatetimeList(this.today);
  }

  public detectAmountOfDaySlots(): void {
    // TODO use code in console.log to detect how many day slots can be represent in present view!
    // console.log(hasScrollbar(this.daySlotsContainer.nativeElement));

    // Detect amount of day slots
    this.amountOfDaySlotsInContainer = Math.floor(this.daySlotsContainer.nativeElement.clientWidth / (60 + 4));
  }

  public prevPackOfDates(): void {
    const [firstDayItem] = this.dayItemList;
    const {datetime} = firstDayItem;
    this.prepareDatetimeList(datetime.minus({
      day: this.amountOfDaySlotsInContainer
    }));
  }

  public nextPackOfDates(): void {
    const lastItem = this.dayItemList[this.dayItemList.length - 1];
    this.prepareDatetimeList(lastItem.datetime.plus({day: 1}));
  }

  public prepareDaySlotsTitle(sourceDatetime: DateTime): string {
    const nextLocalDateTime = sourceDatetime.plus({
      day: this.amountOfDaySlotsInContainer - 1
    });
    let text = sourceDatetime.toFormat('LLLL');
    if (!nextLocalDateTime.hasSame(sourceDatetime, 'month')) {
      if (nextLocalDateTime.hasSame(sourceDatetime, 'year')) {
        text += ` - ${nextLocalDateTime.toFormat('LLLL')}`;
      } else {
        text += ` ${sourceDatetime.toFormat('yyyy')} - ${nextLocalDateTime.toFormat('LLLL yyyy')}`;
      }
    }
    return text;
  }

  public prepareDatetimeList(sourceDatetime: DateTime): void {
    sourceDatetime = sourceDatetime.setLocale(this.translateService.currentLang);
    this.dayItemList = generateDayItemList(sourceDatetime, this.amountOfDaySlotsInContainer);
    this.daySlotsTitle = this.prepareDaySlotsTitle(sourceDatetime);
    this.changeDetectorRef.detectChanges();
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
    return ['text-beeColor-500', 'hover:bg-beeColor-100', 'hover:text-black', 'ring-beeColor-300'];
  }
}
