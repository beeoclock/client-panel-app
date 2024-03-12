import {Injectable} from "@angular/core";
import * as Member from "@member/domain";

@Injectable({
	providedIn: 'root'
})
export class ComposeCalendarWithSpecialistsService {

	/**
	 * TODO: List
	 * - [ ] Add event to the calendar
	 * - [ ] Remove event from the calendar
	 * - [ ] Edit event from the calendar
	 * - [ ] Add event to the calendar by floating button
	 * - [X] Display members in the calendar like a column
	 * - [ ] Display event details by clicking on the event
	 * - [X] Date picker to select the date (left, right, select)
	 * - [ ] Add filter button to filter the events
	 * - [ ] Add filter control: by status
	 * - [X] Detect startTimeToDisplay and endTimeToDisplay by schedules of company
	 */

	public readonly hoursMode = 24;
	public readonly oneHoursInMinutes = 60; // Don't change this value
	public readonly slotInMinutes = 15;
	public readonly stepPerHour = this.oneHoursInMinutes / this.slotInMinutes;
	public readonly heightInPx = 120;
	public readonly heightPerSlotInPx = 120 / this.stepPerHour;
	public readonly headerHeightInPx = 50;

	#startTimeToDisplay = 0; // e.g. 8 (It means: 08:00)
	#endTimeToDisplay = 23; // e.g. 20 (It means: 20:00)
	#members : Member.RIMember[] = [];

	public get startTimeToDisplay(): number {
		return this.#startTimeToDisplay;
	}

	public setStartTimeToDisplay(value: number) {
		this.#startTimeToDisplay = value;
		return this;
	}

	public get endTimeToDisplay(): number {
		return this.#endTimeToDisplay;
	}

	public setEndTimeToDisplay(value: number) {
		this.#endTimeToDisplay = value;
		return this;
	}

	public get members(): Member.RIMember[] {
		return this.#members;
	}

	public setMembers(value: Member.RIMember[]) {
		this.#members = value;
		return this;
	}

}
