import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {DateTime, Interval} from "luxon";
import {AsyncPipe, DatePipe, DOCUMENT, NgIf} from "@angular/common";
import {IonDatetime, IonicModule, IonModal} from "@ionic/angular";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {environment} from "@environment/environment";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {IntervalTypeEnum} from "@module/analytic/internal/domain/enum/interval.enum";
import {NGXLogger} from "ngx-logger";
import {IconComponent} from "@src/component/adapter/icon/icon.component";

@Component({
	selector: 'app-date-slider-control-component',
	templateUrl: './date-slider.control.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		AsyncPipe,
		IonicModule,
		NgIf,
		TranslateModule,
		DatePipe,
		ReactiveFormsModule,
		PrimaryButtonDirective,
		IconComponent
	]
})
export class DateSliderControlComponent extends Reactive implements OnChanges, OnInit {

	@Input({required: true})
	public form = new FormGroup({
		interval: new FormControl<IntervalTypeEnum>(IntervalTypeEnum.day, {
			nonNullable: true
		}),
		selectedDate: new FormControl<string>(DateTime.now().toJSDate().toISOString(), {
			nonNullable: true
		}),
	});

	@Input()
	public initialIntervalType: IntervalTypeEnum = IntervalTypeEnum.day;

	@ViewChild(IonDatetime)
	public ionDateTime!: IonDatetime;

	@ViewChild(IonModal)
	public ionModal!: IonModal;

	public readonly intervalTypeEnum = IntervalTypeEnum;

	public get today() {
		return DateTime.now();
	}

	public readonly intervalTypes = Object.values(IntervalTypeEnum);

	public readonly intervalTypeControl = new FormControl<IntervalTypeEnum>(this.initialIntervalType, {
		nonNullable: true,
	});

	public readonly dateControl = new FormControl<string>(this.today.toJSDate().toISOString(), {
		nonNullable: true,
	});

	public readonly dayCases = {
		isYesterday: () => {
			return {
				enabled: this.today.minus({days: 1}).hasSame(DateTime.fromISO(this.dateControl.value), 'day'),
				translateKey: 'keyword.capitalize.yesterday'
			};
		},
		isToday: () => {
			return {
				enabled: this.today.hasSame(DateTime.fromISO(this.dateControl.value), 'day'),
				translateKey: 'keyword.capitalize.today'
			};
		},
		isTomorrow: () => {
			return {
				enabled: this.today.plus({day: 1}).hasSame(DateTime.fromISO(this.dateControl.value), 'day'),
				translateKey: 'keyword.capitalize.tomorrow'
			};
		},
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
			this.intervalTypeControl.setValue(this.initialIntervalType);
		}
	}

	public ngOnInit() {

		this.initialize();

		this.initListOfOperations();
		this.detectCase();
	}

	public initialize() {

		const {interval, selectedDate} = this.form.getRawValue();
		if (interval) this.intervalTypeControl.setValue(interval);
		if (selectedDate) this.dateControl.setValue(selectedDate);
		this.changeDetectorRef.markForCheck();

	}

	protected cancelChanges() {
		this.ionModal.dismiss({
			intervalType: this.cacheOfCurrentData?.intervalTypeControlValue,
			selectedDate: this.cacheOfCurrentData?.dateControlValue
		}, 'cancel').then();
	}

	protected acceptChanges() {
		const intervalType = this.intervalTypeControl.getRawValue();
		const selectedDate = this.dateControl.getRawValue();

		this.ngxLogger.debug('acceptChanges', {intervalType, selectedDate});

		this.ionModal.dismiss({
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

	protected async setToday() {
		await this.ionDateTime.reset();
		setTimeout(() => {
			this.dateControl.patchValue(this.today.endOf('day').toJSDate().toISOString());
		}, 350)
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

		const {interval, selectedDate} = this.form.getRawValue();

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

		this.intervalTypeControl.setValue(data.intervalType);
		this.dateControl.setValue(data.selectedDate);

		switch (role) {
			case 'accept':
				this.updateForm();
				break;
		}

		this.clearCache();
		this.detectCase();
		this.changeDetectorRef.detectChanges();

	}

	private updateForm() {
		const selectedDate = this.dateControl.getRawValue();
		const interval = this.intervalTypeControl.getRawValue();
		this.form.patchValue({
			interval,
			selectedDate,
		});
	}

	private updateFromAndToControls(method: 'plus' | 'minus') {

		const selectedDate = this.form.controls.selectedDate.value;
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

		const newDateTime = DateTime.fromISO(dateISO)[method]({[interval]: 1}).startOf('day');

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

}
