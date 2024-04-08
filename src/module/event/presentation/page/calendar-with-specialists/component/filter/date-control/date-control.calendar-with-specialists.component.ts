import {Component, inject, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {combineLatest, map} from "rxjs";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";

@Component({
	selector: 'event-date-control-calendar-with-specialists-component',
	template: `
		<div class="relative flex rounded-2xl bg-white shadow-sm items-stretch">

			<button
				(click)="prevDate()"
				type="button"
				class="flex h-9 items-center justify-center rounded-l-2xl border-y border-l border-beeColor-300 text-beeColor-400 hover:text-beeColor-500 focus:relative w-9 pr-0 hover:bg-beeColor-50">
				<i class="bi bi-chevron-left"></i>
			</button>

			<div class="border-y border-beeColor-300 px-3.5 text-beeColor-900 flex flex-col justify-center items-center">

				<span *ngIf="hint$ | async as translateKey" class="text-xs font-semibold">
					{{ translateKey | translate }}
				</span>

				<span [class.text-xs]="isTodayOrTomorrow$ | async" *ngIf="selectedDate$ | async as selectedDate">
					{{ selectedDate.toFormat('yyyy-MM-dd') }}
				</span>

			</div>

			<button
				(click)="nextDate()"
				type="button"
				class="flex h-9 items-center justify-center rounded-r-2xl border-y border-r border-beeColor-300 text-beeColor-400 hover:text-beeColor-500 focus:relative w-9 pl-0 hover:bg-beeColor-50">
				<i class="bi bi-chevron-right"></i>
			</button>

		</div>
	`,
	standalone: true,
	imports: [
		NgIf,
		TranslateModule,
		AsyncPipe
	],
	encapsulation: ViewEncapsulation.None
})
export class DateControlCalendarWithSpecialistsComponent {

	private readonly store = inject(Store);

	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);

	public readonly isTodayOrTomorrowStreams$ = combineLatest([
		this.store.select(CalendarWithSpecialistsQueries.isToday),
		this.store.select(CalendarWithSpecialistsQueries.isTomorrow)
	]);

	public readonly isTodayOrTomorrow$ = this.isTodayOrTomorrowStreams$.pipe(
		map(([isToday, isTomorrow]) => isToday || isTomorrow)
	);

	public readonly hint$ = this.isTodayOrTomorrowStreams$.pipe(
		map(([isToday, isTomorrow]) => {
			switch (true) {
				case isToday:
					return 'keyword.capitalize.today';
				case isTomorrow:
					return 'keyword.capitalize.tomorrow';
				default:
					return '';
			}
		})
	);

	public nextDate() {
		this.store.dispatch(new CalendarWithSpecialistsAction.NextDate());
	}

	public prevDate() {
		this.store.dispatch(new CalendarWithSpecialistsAction.PrevDate());
	}

}
