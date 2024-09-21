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
import {DateTime} from "luxon";
import {AsyncPipe, DatePipe, DOCUMENT, NgIf} from "@angular/common";
import {IonDatetime, IonicModule} from "@ionic/angular";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {environment} from "@environment/environment";

enum IntervalTypeEnum {
	DAY = 'day',
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year',
}

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
		ReactiveFormsModule
	]
})
export class DateSliderControlComponent extends Reactive implements OnChanges, OnInit {

	@Input({required: true})
	public fromToFormGroup = new FormGroup({
		from: new FormControl(),
		to: new FormControl()
	});

	@Input()
	public initialIntervalType: IntervalTypeEnum = IntervalTypeEnum.DAY;

	@ViewChild(IonDatetime)
	public readonly ionDateTime!: IonDatetime;

	public readonly intervalTypeEnum = IntervalTypeEnum;

	public get today() {
		return DateTime.now();
	}

	public readonly datetimeAttributes = {
		max: this.today.toJSDate().toISOString()
	};

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
				enabled: this.dateControl.value === this.today.minus({days: 1}).startOf('day').toJSDate().toISOString(),
				translateKey: 'keyword.capitalize.yesterday'
			};
		},
		isToday: () => {
			return {
				enabled: this.dateControl.value === this.today.startOf('day').toJSDate().toISOString(),
				translateKey: 'keyword.capitalize.today'
			};
		},
		isTomorrow: () => {
			return {
				enabled: this.dateControl.value === this.today.plus({days: 1}).startOf('day').toJSDate().toISOString(),
				translateKey: 'keyword.capitalize.tomorrow'
			};
		},
	};

	public hint: string = '';

	public readonly years = this.today.year - (environment.config.startYear - 1);
	public readonly yearOptions: {
		fromDateTime: DateTime;
		toDateTime: DateTime;
		fromISO: string;
		toISO: string;
	}[] = Array.from({length: (this.years)}, (_, i) => i).map((i) => {
		const fromDateTime = this.today.set({year: environment.config.startYear}).plus({years: i});
		const fromISO = fromDateTime.toJSDate().toISOString();
		let toDateTime = this.today.set({year: environment.config.startYear}).plus({years: i}).endOf('year');
		let toISO = toDateTime.toJSDate().toISOString();
		if (DateTime.fromISO(toISO) > this.today) {
			toDateTime = this.today;
			toISO = toDateTime.toJSDate().toISOString();
		}
		return {
			fromDateTime,
			toDateTime,
			fromISO,
			toISO
		};
	}).reverse();
	public readonly weekOptions: { fromISO: string; toISO: string; }[] = [];

	private readonly changeDetectorRef = inject(ChangeDetectorRef);
	private readonly translateService = inject(TranslateService);
	private readonly document = inject(DOCUMENT);

	public readonly locale = this.translateService.currentLang;

	public ngOnChanges(changes: SimpleChanges & { initialIntervalType?: SimpleChanges }) {
		if (changes.initialIntervalType) {
			this.intervalTypeControl.setValue(this.initialIntervalType);
		}
	}

	public ngOnInit() {
		this.initListOfOperations();
		this.dateControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe((toISO) => {
			this.fromToFormGroup.patchValue({
				from: DateTime.fromISO(toISO).startOf(this.intervalTypeControl.value).toJSDate().toISOString(),
				to: toISO
			})
			this.detectCase();
		});
		this.intervalTypeControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe((intervalType) => {
			this.updateControlByIntervalType(intervalType);
		});
		this.initFromAndToControls();
		this.detectCase();
	}

	public previous() {
		this.updateFromAndToControls('minus');
	}

	public next() {
		this.updateFromAndToControls('plus');
	}

	public async setToday() {
		await this.ionDateTime.reset();
		setTimeout(() => {
			this.initFromAndToControls(true);
			this.detectCase();
			this.changeDetectorRef.detectChanges();
		}, 350)
	}

	public openDateModal() {
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
		firstElementChild.click();
	}

	public getWeekTitle(fromISO: string, toISO: string) {

		const fromDateTime = DateTime.fromISO(fromISO).setLocale(this.locale);
		const toDateTime = DateTime.fromISO(toISO).setLocale(this.locale);

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

	public onIonChange($event: CustomEvent) {
		const {value: toISO} = $event.detail;
		this.dateControl.patchValue(toISO);
	}

	private updateFromAndToControls(method: 'plus' | 'minus') {

		const from = this.fromToFormGroup.controls.from.value;
		const to = this.fromToFormGroup.controls.to.value;
		const intervalType = this.intervalTypeControl.value;

		const {newFrom, newTo} = this.changeInterval(from, to, method, intervalType);

		if (newFrom > newTo) {
			return;
		}

		if (newFrom > this.today) {
			return;
		}

		if (newTo > this.today) {
			return;
		}

		this.dateControl.patchValue(newTo.toJSDate().toISOString());

		this.detectCase();

		this.changeDetectorRef.detectChanges();

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

	private changeInterval(from: string, to: string, method: 'plus' | 'minus', interval: IntervalTypeEnum) {

		const newFrom = DateTime.fromISO(from)[method]({[interval]: 1}).startOf('day');
		let newTo = newFrom.endOf(interval);

		if (newTo > this.today) {
			newTo = this.today;
		}

		return {newFrom, newTo};

	}

	private initFromAndToControls(force: boolean = false) {
		if ((!this.fromToFormGroup.controls.to.value && !this.fromToFormGroup.controls.from.value) || force) {
			this.fromToFormGroup.patchValue({
				from: this.today.startOf('day').toJSDate().toISOString(),
				to: this.today.toJSDate().toISOString()
			});
		}
		this.dateControl.setValue(this.fromToFormGroup.controls.to.value);
	}

	private updateControlByIntervalType(intervalType: IntervalTypeEnum) {

		const dateISO = this.dateControl.value;

		const dateTime = DateTime.fromISO(dateISO);

		if (this.today.hasSame(dateTime, intervalType)) {
			this.dateControl.setValue(this.today.toJSDate().toISOString());
		} else {
			this.dateControl.setValue(dateTime.endOf(intervalType).toJSDate().toISOString());
		}

		this.changeDetectorRef.detectChanges();

	}

	private initListOfOperations() {
		this.weekOptions.length = 0;
		// Add all weeks of period from environment.config.startYear to current year
		for (let year = 0; year <= this.years; year++) {
			const yearDateTime = this.today.set({year: environment.config.startYear}).plus({year});
			const weeks = this.getWeeksInYear(yearDateTime);
			this.weekOptions.push(...weeks);
		}
		this.weekOptions.reverse();
	}

	private getWeeksInYear(year: DateTime) {
		const firstDay = year.startOf('year');
		let lastDay = year.endOf('year');
		if (lastDay > this.today) {
			lastDay = this.today;
		}
		const weeks: {
			fromDateTime: DateTime;
			toDateTime: DateTime;
			fromISO: string;
			toISO: string;
		}[] = [];
		let currentDay = firstDay;
		while (currentDay <= lastDay) {
			const fromDateTime = currentDay;
			let toDateTime = currentDay.endOf('week');
			if (toDateTime > this.today) {
				toDateTime = this.today;
			}
			const fromISO = fromDateTime.toJSDate().toISOString();
			const toISO = toDateTime.toJSDate().toISOString();
			weeks.push({
				fromDateTime,
				toDateTime,
				fromISO,
				toISO
			});
			currentDay = currentDay.plus({weeks: 1});
		}
		return weeks;
	}
}
