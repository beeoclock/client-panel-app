import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ButtonArrowComponent} from "@event/presentation/component/form/select-time-slot/button.arrow.component";
import {filter, Observable} from "rxjs";
import {is} from "thiis";
import {NGXLogger} from "ngx-logger";
import {IDayItem} from "@utility/domain/interface/i.day-item";
import {
	DateSliderSelectService
} from "@utility/presentation/component/slider/date-slider-select/date-slider-select.service";

@Component({
	selector: 'utility-date-slider-select-component',
	templateUrl: './date-slider-select.component.html',
	standalone: true,
	imports: [
		NgForOf,
		NgClass,
		NgIf,
		TranslateModule,
		AsyncPipe,
		ButtonArrowComponent
	],
	providers: [
		DateSliderSelectService,
	]
})
export class DateSliderSelectComponent extends Reactive implements OnInit, AfterViewInit {

	@Input()
	public control!: FormControl<string>;

	@Input()
	public localDateTimeControl!: FormControl<DateTime | null>;

	@Input()
	public controlsAreRequired = true;

	@Input()
	public preventPastDates = true;

	@Input({required: true})
	public dayItemList: IDayItem[] = [];

	@Input({required: true})
	public loader!: BooleanStreamState;

	@Input()
	public firstSlot$: Observable<unknown> | undefined;

	@Output()
	public updateDayItemList = new EventEmitter<IDayItem[]>();

	public selectedDateTime: DateTime | undefined = undefined;
	public today: DateTime = DateTime.now();

	public amountOfDaySlotsInContainer = 0;

	@ViewChild('daySlotsContainer')
	public daySlotsContainer!: ElementRef<HTMLDivElement>;

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly translateService = inject(TranslateService);
	public readonly logger = inject(NGXLogger);
	public readonly selectDateService = inject(DateSliderSelectService);

	public daySlotsTitle = '';

	public ngOnInit(): void {

		Settings.defaultLocale = this.translateService.currentLang;

		if (this.controlsAreRequired) {

			if (this.control.value) {
				this.selectedDateTime = DateTime.fromISO(this.control.value);
			}

			this.control.valueChanges.pipe(this.takeUntil()).subscribe((VALUE) => {
				this.selectedDateTime = DateTime.fromISO(VALUE);
				this.localDateTimeControl.patchValue(this.selectedDateTime);
				this.changeDetectorRef.detectChanges();
			});

			if (this.firstSlot$) {
				this.firstSlot$.pipe(
					this.takeUntil(),
					filter(is.object<{ start: DateTime; end: DateTime; }>),
				).subscribe((firstSlot) => {
					this.control.patchValue(firstSlot.start.toJSDate().toISOString());
				})
			}

		}

	}

	public ngAfterViewInit(): void {
		this.detectAmountOfDaySlots();
		this.prepareDatetimeList(this.today).then();
	}

	public detectAmountOfDaySlots(): void {
		// Detect amount of day slots
		const {clientWidth} = this.daySlotsContainer.nativeElement;
		const dayWidth = 60;
		const dayMargin = 16;
		this.amountOfDaySlotsInContainer = Math.floor(clientWidth / (dayWidth + dayMargin));
	}

	public prevPackOfDates(): void {
		const [firstDayItem] = this.dayItemList;
		if (this.preventPastDates && firstDayItem.isToday) {
			return;
		}
		const {datetime} = firstDayItem;
		this.prepareDatetimeList(datetime.minus({
			day: this.amountOfDaySlotsInContainer
		})).then();
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

	public async prepareDatetimeList(sourceDatetime: DateTime) {
		this.logger.debug('prepareDatetimeList', sourceDatetime);
		sourceDatetime = sourceDatetime.setLocale(this.translateService.currentLang);
		this.daySlotsTitle = this.prepareDaySlotsTitle(sourceDatetime);
		const dayItemList = this.selectDateService.generateDayItemList(sourceDatetime, this.amountOfDaySlotsInContainer);
		this.updateDayItemList.emit(dayItemList);
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
		if (!this.selectedDateTime) {
			return false;
		}
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
