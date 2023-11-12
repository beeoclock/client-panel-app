import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DateTime, Settings} from "luxon";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Reactive} from "@utility/cdk/reactive";
import {SlotsService} from "@event/presentation/component/form/select-time-slot/slots.service";
import {BooleanStreamState} from "@utility/domain/boolean-stream.state";
import {ButtonArrowComponent} from "@event/presentation/component/form/select-time-slot/button.arrow.component";
import {SelectDateService} from "@event/presentation/component/form/select-time-slot/date/select-date.service";
import {filter} from "rxjs";
import {is} from "thiis";
import {NGXLogger} from "ngx-logger";

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
	providers: [
		SelectDateService,
	]
})
export class SelectDateComponent extends Reactive implements OnInit, AfterViewInit {

	@Input()
	public control!: FormControl<string>;

	@Input()
	public localDateTimeControl!: FormControl<DateTime>;

	public selectedDateTime = DateTime.now();
	public today = DateTime.now();

	public amountOfDaySlotsInContainer = 0;

	@ViewChild('daySlotsContainer')
	public daySlotsContainer!: ElementRef<HTMLDivElement>;

	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly translateService = inject(TranslateService);
	public readonly logger = inject(NGXLogger);
	public readonly slotsService = inject(SlotsService);
	public readonly selectDateService = inject(SelectDateService);

	public get loader(): BooleanStreamState {
		return this.slotsService.loader;
	}

	public daySlotsTitle = '';

	public get dayItemList() {
		return this.slotsService.dayItemList;
	}

	public ngOnInit(): void {

		Settings.defaultLocale = this.translateService.currentLang;

		if (this.control.value) {
			this.selectedDateTime = DateTime.fromISO(this.control.value);
		}

		this.control.valueChanges.pipe(this.takeUntil()).subscribe((VALUE) => {
			this.selectedDateTime = DateTime.fromISO(VALUE);
			this.localDateTimeControl.patchValue(this.selectedDateTime);
			this.changeDetectorRef.detectChanges();
		});

		this.slotsService.firstSlot$.pipe(
			this.takeUntil(),
			filter(is.object<{start: DateTime; end: DateTime;}>),
		).subscribe((firstSlot) => {
			this.control.patchValue(firstSlot.start.toJSDate().toISOString());
		});

	}

	public ngAfterViewInit(): void {
		this.detectAmountOfDaySlots();
		this.prepareDatetimeList(this.today).then();
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
		})).then();
	}

	public nextPackOfDates(): void {
		const lastItem = this.dayItemList[this.dayItemList.length - 1];
		this.prepareDatetimeList(lastItem.datetime.plus({day: 1})).then();
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
		await this.slotsService
			.setDayItemList(dayItemList)
			.initSlots();
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
