import {Component, inject, ViewEncapsulation} from "@angular/core";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.service";

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

				<span *ngIf="selectedDateIsToday || selectedDateIsTomorrow" class="text-xs font-semibold">
					{{ (selectedDateIsToday ? 'keyword.capitalize.today' : selectedDateIsTomorrow ? 'keyword.capitalize.tomorrow' : '') | translate }}
				</span>

				<span [class.text-xs]="selectedDateIsToday || selectedDateIsTomorrow">
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
		TranslateModule
	],
	encapsulation: ViewEncapsulation.None
})
export class DateControlCalendarWithSpecialistsComponent {

	private readonly dateControlCalendarWithSpecialistsService = inject(DateControlCalendarWithSpecialistsService);

	public get selectedDate() {
		return this.dateControlCalendarWithSpecialistsService.selectedDate;
	}

	public nextDate() {
		this.dateControlCalendarWithSpecialistsService.nextDate();
	}

	public prevDate() {
		this.dateControlCalendarWithSpecialistsService.prevDate();
	}

	public get selectedDateIsToday() {
		return this.dateControlCalendarWithSpecialistsService.selectedDateIsToday;
	}

	public get selectedDateIsTomorrow() {
		return this.dateControlCalendarWithSpecialistsService.selectedDateIsTomorrow;
	}

}
