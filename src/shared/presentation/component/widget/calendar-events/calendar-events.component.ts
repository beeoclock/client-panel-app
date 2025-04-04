import {Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrimaryLinkButtonDirective} from "@shared/presentation/directives/button/primary.link.button.directive";
import {Reactive} from "@core/cdk/reactive";
import {RIEvent} from "@tenant/event/domain";
import {LoaderComponent} from "@shared/presentation/component/loader/loader.component";
import {
	EventStatusStyleDirective
} from "@tenant/event/presentation/directive/event-status-style/event-status-style.directive";
import {IonSelectWrapperComponent} from "@shared/presentation/component/input/ion/ion-select-wrapper.component";
import {DynamicDateHelper} from "@shared/presentation/pipes/dynamic-date/dynamic-date.helper";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {ActionComponent} from "@shared/presentation/component/table/column/action.component";
import {HumanizeDurationPipe} from "@shared/presentation/pipes/humanize-duration.pipe";
import {NoDataPipe} from "@shared/presentation/pipes/no-data.pipe";
import {
	DateSliderSelectComponent
} from "@shared/presentation/component/slider/date-slider-select/date-slider-select.component";
import {IDayItem} from "@shared/domain/interface/i.day-item";
import {BooleanStreamState} from "@shared/domain/boolean-stream.state";
import {DateTime} from "luxon";

@Component({
	selector: 'utility-widget-calendar-events',
	templateUrl: './calendar-events.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		RouterLink,
		TranslateModule,
		NgForOf,
		ReactiveFormsModule,
		FormsModule,
		PrimaryLinkButtonDirective,
		NgIf,
		LoaderComponent,
		EventStatusStyleDirective,
		IonSelectWrapperComponent,
		DynamicDatePipe,
		ActionComponent,
		CurrencyPipe,
		DatePipe,
		HumanizeDurationPipe,
		NoDataPipe,
		DateSliderSelectComponent,
	]
})
export class CalendarEventsComponent extends Reactive implements OnInit {

	// private readonly calendarEventsListApiAdapter = inject(CalendarEventsListApiAdapter);
	private readonly router = inject(Router);
	private readonly dynamicDateHelper = inject(DynamicDateHelper);
	public readonly returnUrl = this.router.url;
	public readonly selectedDateControl = new FormControl(DateTime.now()) as FormControl<DateTime>;
	public items: RIEvent[] = [];

	public dayItemList: IDayItem[] = [];
	public readonly loader = new BooleanStreamState(true);

	public updateDayItemList(dayItemList: IDayItem[]) {
		this.loader.doTrue();
		// const firstDay = dayItemList[0];
		// const lastDay = dayItemList[dayItemList.length - 1];
		// this.calendarEventsListApiAdapter.executeAsync({
		// 	start: firstDay.datetime.startOf('day').toJSDate().toISOString(),
		// 	end: lastDay.datetime.endOf('day').toJSDate().toISOString(),
		// 	pageSize: 100,
		// 	orderBy: OrderByEnum.START,
		// 	orderDir: OrderDirEnum.ASC,
		// 	status: EventStatusEnum.booked,
		// }).then((data) => {
		// 	data.items.forEach((item) => {
		// 		const start = DateTime.fromISO(item.start);
		// 		const dayItem = dayItemList.find((dayItem) => {
		// 			return dayItem.datetime.hasSame(start, 'day');
		// 		});
		// 		if (dayItem) {
		// 			dayItem.events.push(item);
		// 		}
		// 	});
		// 	this.dayItemList = dayItemList;
		// 	if (this.selectedDateControl.value >= firstDay.datetime && this.selectedDateControl.value <= lastDay.datetime) {
		// 		this.updateItems(this.selectedDateControl.value);
		// 	}
		// 	this.loader.doFalse();
		// });
	}

	constructor() {
		super();
	}

	public ngOnInit(): void {
		this.selectedDateControl.valueChanges.pipe(
			this.takeUntil()
		).subscribe((value) => {
			this.updateItems(value);
		});
	}

	private updateItems(value: DateTime) {
		// Get items from this.dayItemList
		const dayItem = this.dayItemList.find((dayItem) => {
			return dayItem.datetime.hasSame(value, 'day');
		});
		this.items = (dayItem?.events ?? []) as RIEvent[];
	}

	public dynamicDate(value: string | null): string {
		return this.dynamicDateHelper.transform(value ?? '', 'shortDate');
	}

}
