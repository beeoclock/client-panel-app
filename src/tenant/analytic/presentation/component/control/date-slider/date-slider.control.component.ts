import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	input,
	OnChanges,
	OnInit,
	SimpleChanges,
	viewChild,
	ViewEncapsulation
} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateTime, Interval} from "luxon";
import {DatePipe, DOCUMENT} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Reactive} from "@core/cdk/reactive";
import {environment} from "@environment/environment";
import {PrimaryButtonDirective} from "@shared/presentation/directives/button/primary.button.directive";
import {IntervalTypeEnum} from "@tenant/analytic/domain/enum/interval.enum";
import {NGXLogger} from "ngx-logger";
import {
	IonDatetime,
	IonDatetimeButton,
	IonItem,
	IonLabel,
	IonList,
	IonModal,
	IonPicker,
	IonPickerColumn,
	IonPickerColumnOption,
	IonSegment,
	IonSegmentButton
} from "@ionic/angular/standalone";


@Component({
	selector: 'app-date-slider-control-component',
	templateUrl: './date-slider.control.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		TranslateModule,
		DatePipe,
		ReactiveFormsModule,
		PrimaryButtonDirective,
		IonModal,
		IonDatetime,
		IonList,
		IonItem,
		IonLabel,
		IonPicker,
		IonPickerColumn,
		IonPickerColumnOption,
		IonSegmentButton,
		IonSegment,
		IonDatetimeButton,
	]
})
export class DateSliderControlComponent extends Reactive implements OnChanges, OnInit {

	public readonly form = input.required<FormGroup<{
		interval: FormControl<IntervalTypeEnum>;
		selectedDate: FormControl<string>;
	}>>();

	public readonly initialIntervalType = input<IntervalTypeEnum>(IntervalTypeEnum.day);

	public readonly onlyWeek = input<boolean>(true);

	readonly ionDateTime = viewChild.required(IonDatetime);

	readonly ionModal = viewChild.required(IonModal);

	public readonly intervalTypeEnum = IntervalTypeEnum;

	public get today() {
		return DateTime.now();
	}

	public readonly intervalTypes = [
		IntervalTypeEnum.day,
		IntervalTypeEnum.week,
		IntervalTypeEnum.month,
		IntervalTypeEnum.year,
	];

	public readonly intervalTypeControl = new FormControl<IntervalTypeEnum>(this.initialIntervalType(), {
		nonNullable: true,
	});

	public readonly dateControl = new FormControl<string>(this.today.toJSDate().toISOString(), {
		nonNullable: true,
	});

	public readonly dayCases = {
		isYesterday: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.day;
			if (enabled) {
				enabled = this.today.minus({days: 1}).hasSame(DateTime.fromISO(this.dateControl.value), 'day');
			}
			return {
				enabled,
				translateKey: 'keyword.capitalize.yesterday'
			};
		},
		isToday: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.day;
			if (enabled) {
				enabled = this.today.hasSame(DateTime.fromISO(this.dateControl.value), 'day');
			}
			return {
				enabled,
				translateKey: 'keyword.capitalize.today'
			};
		},
		isTomorrow: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.day;
			if (enabled) {
				enabled = this.today.plus({day: 1}).hasSame(DateTime.fromISO(this.dateControl.value), 'day');
			}
			return {
				enabled,
				translateKey: 'keyword.capitalize.tomorrow'
			};
		},
		isThisWeek: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.week;
			if (enabled) {
				enabled = this.today.startOf('week').hasSame(DateTime.fromISO(this.dateControl.value), 'week');
			}
			return {
				enabled,
				translateKey: 'event.statistic.period.THIS_WEEK'
			};
		},
		isLastWeek: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.week;
			if (enabled) {
				enabled = this.today.minus({week: 1}).startOf('week').hasSame(DateTime.fromISO(this.dateControl.value), 'week');
			}
			return {
				enabled,
				translateKey: 'event.statistic.period.LAST_WEEK'
			};
		},
		isNextWeek: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.week;
			if (enabled) {
				enabled = this.today.plus({week: 1}).startOf('week').hasSame(DateTime.fromISO(this.dateControl.value), 'week');
			}
			return {
				enabled,
				translateKey: 'event.statistic.period.NEXT_WEEK'
			};
		},
		isThisMonth: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.month;
			if (enabled) {
				enabled = this.today.startOf('month').hasSame(DateTime.fromISO(this.dateControl.value), 'month');
			}
			return {
				enabled,
				translateKey: 'event.statistic.period.THIS_MONTH'
			};
		},
		isLastMonth: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.month;
			if (enabled) {
				enabled = this.today.minus({month: 1}).startOf('month').hasSame(DateTime.fromISO(this.dateControl.value), 'month');
			}
			return {
				enabled,
				translateKey: 'event.statistic.period.LAST_MONTH'
			};
		},
		isNextMonth: () => {
			let enabled = this.intervalTypeControl.value === IntervalTypeEnum.month;
			if (enabled) {
				enabled = this.today.plus({month: 1}).startOf('month').hasSame(DateTime.fromISO(this.dateControl.value), 'month');
			}
			return {
				enabled,
				translateKey: 'event.statistic.period.NEXT_MONTH'
			};
		}
	};

	public hint: string = '';

	public readonly years = this.today.year - (environment.config.startYear - 1);
	public readonly yearOptions: {
		dateTimeISO: string;
	}[] = this.getYearISOList();
	public readonly weekOptions: {
		fromISO: string;
		toISO: string;
		title: string;
	}[] = [];

	public readonly datetimeAttributes = {
		min: this.today.set({year: environment.config.startYear}).toJSDate().toISOString(),
		max: this.today.set({year: environment.config.startYear}).plus({year: this.years}).endOf('year').startOf('week').toJSDate().toISOString(),
	};

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly translateService = inject(TranslateService);
	private readonly document = inject(DOCUMENT);
	private readonly ngxLogger = inject(NGXLogger);

	public readonly locale = this.translateService.currentLang;

	protected cacheOfCurrentData: {
		dateControlValue: string;
		intervalTypeControlValue: IntervalTypeEnum;
	} | null = null;

	public ngOnChanges(changes: SimpleChanges & { initialIntervalType?: SimpleChanges }) {
		if (changes.initialIntervalType) {
			this.intervalTypeControl.setValue(this.initialIntervalType());
			this.detectCase();
			this.changeDetectorRef.detectChanges();
		}
	}

	public ngOnInit() {

		this.initialize();

		this.initListOfOperations();
		this.detectCase();
	}

	public initialize() {

		const {interval, selectedDate} = this.form().getRawValue();
		if (interval) this.intervalTypeControl.setValue(interval);
		if (selectedDate) this.dateControl.setValue(selectedDate);
		this.changeDetectorRef.markForCheck();

	}

	protected cancelChanges() {
		this.ionModal().dismiss({}, 'cancel').then();
	}

	protected acceptChanges() {
		const intervalType = this.intervalTypeControl.getRawValue();
		const selectedDate = this.dateControl.getRawValue();

		this.ngxLogger.debug('acceptChanges', {intervalType, selectedDate});

		this.ionModal().dismiss({
			intervalType,
			selectedDate
		}, 'accept').then();
	}

	public previous() {
		this.updateFromAndToControls('minus');
	}

	public next() {
		this.updateFromAndToControls('plus');
	}

	protected setYesterday() {
		this.dateControl.patchValue(this.today.minus({days: 1}).endOf('day').toJSDate().toISOString());
	}

	protected async setToday() {
		await this.ionDateTime().reset();
		this.dateControl.patchValue(this.today.endOf('day').toJSDate().toISOString());
	}

	protected setTomorrow() {
		this.dateControl.patchValue(this.today.plus({days: 1}).endOf('day').toJSDate().toISOString());
	}

	protected openDateModal() {
		const button = this.document.getElementById('hidden-ion-datetime-button');
		if (!button) {
			return;
		}
		const {shadowRoot} = button;
		if (!shadowRoot) {
			return;
		}
		const {firstElementChild} = shadowRoot as unknown as { firstElementChild: HTMLButtonElement };
		if (!firstElementChild) {
			return;
		}
		this.cacheCurrentData();
		firstElementChild.click();
	}

	protected getRangeInISO() {

		const {interval, selectedDate} = this.form().getRawValue();

		return this.getRangeInISOByInterval(interval, selectedDate);
	}

	protected getRangeInISOByInterval(interval: IntervalTypeEnum, selectedDate: string) {
		const fromDateTime = DateTime.fromISO(selectedDate).startOf(interval);
		const toDateTime = DateTime.fromISO(selectedDate).endOf(interval);

		return {
			fromISO: fromDateTime.toJSDate().toISOString(),
			toISO: toDateTime.toJSDate().toISOString()
		};
	}

	protected getWeekTitle(fromISO: string, toISO: string) {

		const fromDateTime = DateTime.fromISO(fromISO).toLocal().setLocale(this.locale);
		const toDateTime = DateTime.fromISO(toISO).toLocal().setLocale(this.locale);

		if (fromDateTime.hasSame(toDateTime, 'month')) {

			let daySlotsTitle = `${fromDateTime.toFormat('d')} - ${toDateTime.toFormat('d')} ${toDateTime.toFormat('LLL')}`;

			if (!this.today.hasSame(fromDateTime, 'year')) {
				daySlotsTitle += ` ${fromDateTime.toFormat('yyyy')}`;
			}

			return daySlotsTitle;
		}

		if (fromDateTime.hasSame(toDateTime, 'year')) {

			let daySlotsTitle = `${fromDateTime.toFormat('d LLL')} - ${toDateTime.toFormat('d LLL')}`;

			if (!this.today.hasSame(fromDateTime, 'year')) {
				daySlotsTitle += ` ${fromDateTime.toFormat('yyyy')}`;
			}

			return daySlotsTitle;
		}

		return `${fromDateTime.toFormat('d LLL yyyy')} - ${toDateTime.toFormat('d LLL yyyy')}`;

	}

	protected onIonChange($event: CustomEvent) {
		const {value: dateTimeISO} = $event.detail;
		this.dateControl.patchValue(dateTimeISO);
	}

	protected didDismiss($event: CustomEvent) {

		const {data, role} = $event.detail as {
			data: {
				intervalType: IntervalTypeEnum;
				selectedDate: string;
			},
			role: 'accept' | 'cancel'
		};

		const {dateControlValue, intervalTypeControlValue} = this.cacheOfCurrentData ?? {};

		switch (role) {
			case 'accept':
				this.intervalTypeControl.setValue(data.intervalType);
				this.dateControl.setValue(data.selectedDate);
				this.updateForm();
				break;
			case 'cancel':
				if (dateControlValue) this.dateControl.patchValue(dateControlValue);
				if (intervalTypeControlValue) this.intervalTypeControl.patchValue(intervalTypeControlValue);
				break;
		}

		this.clearCache();
		this.detectCase();
		this.changeDetectorRef.detectChanges();

	}

	private updateForm() {
		const selectedDate = this.dateControl.getRawValue();
		const interval = this.intervalTypeControl.getRawValue();
		this.form().patchValue({
			interval,
			selectedDate,
		});
	}

	private updateFromAndToControls(method: 'plus' | 'minus') {

		const selectedDate = this.form().controls.selectedDate.value;
		const intervalType = this.intervalTypeControl.value;

		const {newDateTime} = this.changeInterval(selectedDate, method, intervalType);

		this.dateControl.patchValue(newDateTime.toJSDate().toISOString());
		this.updateForm();
		this.detectCase();

		this.changeDetectorRef.detectChanges();

	}

	private clearCache() {
		this.cacheOfCurrentData = null;
	}

	private cacheCurrentData() {
		this.cacheOfCurrentData = {
			dateControlValue: this.dateControl.value,
			intervalTypeControlValue: this.intervalTypeControl.value
		};
	}

	private detectCase() {
		this.hint = '';
		Object.entries(this.dayCases).forEach(([key, fn]) => {
			const result = fn();
			if (result.enabled) {
				this.hint = result.translateKey;
			}
		});
	}

	private changeInterval(dateISO: string, method: 'plus' | 'minus', interval: IntervalTypeEnum) {

		const newDateTime = DateTime.fromISO(dateISO)[method]({[interval]: 1});

		return {newDateTime};

	}

	private initListOfOperations() {
		this.weekOptions.length = 0;
		const fromDateTime = this.today.set({year: environment.config.startYear}).endOf('year').startOf('week');
		const toDateTime = fromDateTime.plus({years: this.years}).endOf('year').startOf('week');

		Interval.fromDateTimes(fromDateTime, toDateTime).splitBy({weeks: 1}).forEach((interval) => {
			const {start, end} = interval;
			if (!start || !end) {
				return;
			}

			const {
				fromISO,
				toISO
			} = this.getRangeInISOByInterval(IntervalTypeEnum.week, start.toJSDate().toISOString());

			this.weekOptions.push({
				fromISO,
				toISO,
				title: this.getWeekTitle(fromISO, toISO)
			});
		});

		this.weekOptions.reverse();
	}

	private getYearISOList() {
		const fromDateTime = this.today.set({year: environment.config.startYear}).endOf('year').startOf('week');
		const toDateTime = fromDateTime.plus({years: this.years}).endOf('year').startOf('week');
		return Interval.fromDateTimes(fromDateTime, toDateTime).splitBy({years: 1}).map((interval) => {
			const {start} = interval;
			if (!start) {
				return null;
			}
			const dateTimeISO = start.toJSDate().toISOString();
			return {
				dateTimeISO
			};
		}).filter((item) => item !== null).reverse() as { dateTimeISO: string }[];
	}

	protected convertIntoEndOfWeek(value: string) {
		return DateTime.fromISO(value).endOf('week').toJSDate().toISOString();
	}

	protected setYear($event: CustomEvent) {
		const year = $event.detail.value;
		const fromDateTime = DateTime.fromISO(year).endOf('year').startOf('week');
		this.dateControl.patchValue(fromDateTime.toJSDate().toISOString());
	}

	protected setLastWeek() {
		const fromDateTime = this.today.minus({weeks: 1}).startOf('week');
		this.dateControl.patchValue(fromDateTime.toJSDate().toISOString());
	}

	protected setThisWeek() {
		const fromDateTime = this.today.startOf('week');
		this.dateControl.patchValue(fromDateTime.toJSDate().toISOString());
	}

	protected setNextWeek() {
		const fromDateTime = this.today.plus({weeks: 1}).startOf('week');
		this.dateControl.patchValue(fromDateTime.toJSDate().toISOString());
	}

	protected setLastMonth() {
		const fromDateTime = this.today.minus({months: 1});
		this.dateControl.patchValue(fromDateTime.toJSDate().toISOString());
	}

	protected setThisMonth() {
		this.dateControl.patchValue(this.today.toJSDate().toISOString());
	}

	protected setNextMonth() {
		const fromDateTime = this.today.plus({months: 1});
		this.dateControl.patchValue(fromDateTime.toJSDate().toISOString());
	}
}
