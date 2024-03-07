import {Injectable} from "@angular/core";
import {DateTime} from "luxon";

@Injectable({
	providedIn: 'root'
})
export class DateControlCalendarWithSpecialistsService {

	public readonly currentDate = DateTime.now();

	public selectedDate = DateTime.now();

	public nextDate() {
		this.selectedDate = this.selectedDate.plus({days: 1});
	}

	public prevDate() {
		this.selectedDate = this.selectedDate.minus({days: 1});
	}

	public get selectedDateIsToday() {
		return this.selectedDate.hasSame(this.currentDate, 'day');
	}

	public get selectedDateIsTomorrow() {
		return this.selectedDate.hasSame(this.currentDate.plus({days: 1}), 'day');
	}

}
