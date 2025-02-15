import {Injectable} from "@angular/core";
import * as Member from "../../../../../core/business-logic/member";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {BehaviorSubject} from "rxjs";
import {
	EventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/elements-on-calendar/event.calendar-with-specialist.widget.component";
import {FormControl} from "@angular/forms";

@Injectable({
	providedIn: 'root'
})
export default class CalendarWithSpecialistLocaStateService {

	// Property to control amount of available button in each hour cell to add event
	public readonly maxCreateEventButtonInHourCell = 2; // 2 buttons: 1 for each 30 minutes
	public readonly createEventButtonDurationInMinutes = 60 / this.maxCreateEventButtonInHourCell;

	public readonly specialistCellHeightForPx = 50;
	public readonly specialistCellHeightInPx = `${this.specialistCellHeightForPx}px`;

	public readonly oneHourForPx = 120;
	public readonly oneHourInPx = `${this.oneHourForPx}px`;
	public readonly oneMinuteForPx = this.oneHourForPx / 60;

	public readonly movementInMinutesControl = new FormControl<number>(1, {
		nonNullable: true
	});

	public readonly hourRowListInPx = Array.from({length: 24}, (_, i) => {
		return {
			original: i,
			// hour format: 00:00
			hour: `${String(i).padStart(2, '0')}:00`,
			isOdd: i % 2 === 1,
			isEven: i % 2 === 0
		}
	});

	public readonly createEventButtonList = Array.from({length: 24}).flatMap((_, hour) => {
		return Array.from({length: this.maxCreateEventButtonInHourCell}).map((__, hourPeace) => {
			return {
				id: `${hour}_${hourPeace}`,
				startInMinutes: (hour * 60) + (hourPeace * this.createEventButtonDurationInMinutes),
				durationInMinutes: this.createEventButtonDurationInMinutes,
				heightInPx: `${this.oneHourForPx / this.maxCreateEventButtonInHourCell}px`,
				isLastPeace: this.maxCreateEventButtonInHourCell - 1 === hourPeace
			}
		});
	});

	public readonly columnHeightForPx = (this.oneHourForPx * 24) + this.specialistCellHeightForPx;
	public readonly columnHeightInPx = `${this.columnHeightForPx}px`;

	public readonly cellWidthInPx = '160px';
	public readonly hoursWidthInPx = '50px';

	public readonly eventCalendarWithSpecialistWidgetComponent$ = new BehaviorSubject<EventCalendarWithSpecialistWidgetComponent | null>(null);
	#earliestScheduleInSeconds = 0;
	#latestScheduleInSeconds = 0;
	#startTimeToDisplay = 0; // e.g. 8 (It means: 08:00)
	#endTimeToDisplay = 23; // e.g. 20 (It means: 20:00)
	#members: Member.RIMember[] = [];
	#schedules: ISchedule[] = [];

	public get startTimeToDisplay(): number {
		return this.#startTimeToDisplay;
	}

	public get earliestScheduleInSeconds(): number {
		return this.#earliestScheduleInSeconds;
	}

	public get endTimeToDisplay(): number {
		return this.#endTimeToDisplay;
	}

	public get latestScheduleInSeconds(): number {
		return this.#latestScheduleInSeconds;
	}

	public get members(): Member.RIMember[] {
		return this.#members;
	}

	public get schedules(): ISchedule[] {
		return this.#schedules;
	}

	public setEventCalendarWithSpecialistWidgetComponent(value: EventCalendarWithSpecialistWidgetComponent | null) {
		this.eventCalendarWithSpecialistWidgetComponent$.next(value);
		return this;
	}

	public setStartTimeToDisplay(value: number) {
		this.#startTimeToDisplay = value;
		return this;
	}

	public setEarliestScheduleInSeconds(value: number) {
		this.#earliestScheduleInSeconds = value;
		return this;
	}

	public setEndTimeToDisplay(value: number) {
		this.#endTimeToDisplay = value;
		return this;
	}

	public setLatestScheduleInSeconds(value: number) {
		this.#latestScheduleInSeconds = value;
		return this;
	}

	public setMembers(value: Member.RIMember[]) {
		this.#members = value;
		return this;
	}

	public setSchedules(value: ISchedule[]) {
		this.#schedules = value;
		return this;
	}


}
