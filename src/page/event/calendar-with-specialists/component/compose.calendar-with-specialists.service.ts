import {Injectable} from "@angular/core";
import * as Member from "@member/domain";

@Injectable()
export class ComposeCalendarWithSpecialistsService {

	public readonly hoursMode = 24;
	public readonly oneHoursInMinutes = 60; // Don't change this value
	public readonly slotInMinutes = 10;
	public readonly stepPerHour = this.oneHoursInMinutes / this.slotInMinutes;
	public readonly oneHourHeightInPx = 180;
	public readonly heightPerSlotInPx = this.oneHourHeightInPx / this.stepPerHour;
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
