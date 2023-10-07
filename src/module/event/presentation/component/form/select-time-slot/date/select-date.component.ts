import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ButtonArrowComponent} from "@event/presentation/component/form/select-time-slot/button.arrow.component";

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
	templateUrl: './select-date.component.html',
	standalone: true,
	imports: [
		NgForOf,
		NgClass,
		NgIf,
		TranslateModule,
		AsyncPipe,
		ButtonArrowComponent
	],
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
	public readonly slotsService = inject(SlotsService);

	public get loader(): BooleanStreamState {
		return this.slotsService.loader;
	}

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
