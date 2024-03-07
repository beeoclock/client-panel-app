import {Component, inject, ViewEncapsulation} from "@angular/core";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/date-control/date-control.calendar-with-specialists.service";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
	selector: 'event-date-control-calendar-with-specialists-component',
	template: `
		<div class="relative flex rounded-md bg-white shadow-sm items-stretch">

			<button
				(click)="prevDate()"
				type="button"
				class="flex h-9 items-center justify-center rounded-l-md border-y border-l border-gray-300 text-gray-400 hover:text-gray-500 focus:relative w-9 pr-0 hover:bg-gray-50">
				<i class="bi bi-chevron-left"></i>
			</button>

			<div class="border-y border-gray-300 px-3.5 text-gray-900 flex flex-col justify-center items-center">

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
				class="flex h-9 items-center justify-center rounded-r-md border-y border-r border-gray-300 text-gray-400 hover:text-gray-500 focus:relative w-9 pl-0 hover:bg-gray-50">
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
