import {Injectable} from "@angular/core";
import * as Member from "@member/domain";

@Injectable({
	providedIn: 'root'
})
export class ComposeCalendarWithSpecialistsService {

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
