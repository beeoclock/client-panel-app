import {Component, inject, ViewEncapsulation} from "@angular/core";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/date-control/date-control.calendar-with-specialists.service";
import {NgIf} from "@angular/common";

@Component({
	selector: 'event-date-control-calendar-with-specialists-component',
	template: `

		<div class="relative flex rounded-md bg-white shadow-sm items-stretch">
			<button
				(click)="prevDate()"
				type="button"
				class="flex h-9  items-center justify-center rounded-l-md border-y border-l border-gray-300 text-gray-400 hover:text-gray-500 focus:relative w-9 pr-0 hover:bg-gray-50">
				<span class="sr-only">Previous month</span>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd"
								d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
								clip-rule="evenodd"/>
				</svg>
			</button>
			<button type="button"
							class="border-y border-gray-300 px-3.5 text-gray-900 hover:bg-gray-50 focus:relative flex flex-col justify-center items-center">
				<span *ngIf="selectedDateIsToday || selectedDateIsTomorrow" class="text-xs font-semibold">
					{{ selectedDateIsToday ? 'Today' : selectedDateIsTomorrow ? 'Tomorrow' : ''}}
				</span>
				<span [class.text-xs]="selectedDateIsToday || selectedDateIsTomorrow">{{ selectedDate.toFormat('yyyy-MM-dd') }}</span>
			</button>
			<button
				(click)="nextDate()"
				type="button"
				class="flex h-9 items-center justify-center rounded-r-md border-y border-r border-gray-300 text-gray-400 hover:text-gray-500 focus:relative w-9 pl-0 hover:bg-gray-50">
				<span class="sr-only">Next month</span>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd"
								d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
								clip-rule="evenodd"/>
				</svg>
			</button>
		</div>

	`,
	standalone: true,
	imports: [
		NgIf
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
