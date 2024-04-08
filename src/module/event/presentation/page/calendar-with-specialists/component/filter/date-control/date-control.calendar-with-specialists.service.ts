import {Injectable} from "@angular/core";
import {DateTime} from "luxon";
import {BehaviorSubject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class DateControlCalendarWithSpecialistsService {

	public readonly currentDate = DateTime.now();

	public readonly selectedDate$ = new BehaviorSubject(this.currentDate);

	public get selectedDate() {
		return this.selectedDate$.value;
	}

	public nextDate() {
		this.selectedDate$.next(this.selectedDate.plus({days: 1}))
	}

	public prevDate() {
		this.selectedDate$.next(this.selectedDate.minus({days: 1}))
	}

	public setDateTime(datetime: DateTime) {
		if (!datetime.isValid) {
			throw new Error('Invalid datetime');
		}

		if (this.selectedDate$.value.hasSame(datetime, 'day')) {
			return;
		}

		this.selectedDate$.next(datetime);
	}

	public get selectedDateIsToday() {
		return this.selectedDate.hasSame(this.currentDate, 'day');
	}

	public get selectedDateIsTomorrow() {
		return this.selectedDate.hasSame(this.currentDate.plus({days: 1}), 'day');
	}

}
