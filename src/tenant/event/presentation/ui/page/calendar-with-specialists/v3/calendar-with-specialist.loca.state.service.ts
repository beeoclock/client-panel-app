import {Injectable, signal} from "@angular/core";
import {ISchedule} from "@shared/domain/interface/i.schedule";
import {BehaviorSubject} from "rxjs";
import {
	EventCalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/elements-on-calendar/event.calendar-with-specialist.widget.component";
import {FormControl} from "@angular/forms";
import {IMember} from "@tenant/member/member/domain/interface/i.member";

@Injectable({
	providedIn: 'root'
})
export default class CalendarWithSpecialistLocaStateService {

	// Property to control amount of available button in each hour cell to add event
	public readonly maxCreateEventButtonInHourCell = 2; // 2 buttons: 1 for each 30 minutes
	public readonly createEventButtonDurationInMinutes = 60 / this.maxCreateEventButtonInHourCell;

	public readonly specialistCellHeightForPx = 0;
	public readonly specialistCellHeightInPx = `${this.specialistCellHeightForPx}px`;

	public readonly oneHourForPx = 60;
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

	public readonly cellWidthInPx = '328px';
	public readonly hoursWidthInPx = '50px';

	public readonly eventCalendarWithSpecialistWidgetComponent$ = new BehaviorSubject<EventCalendarWithSpecialistWidgetComponent | null>(null);
	public readonly earliestScheduleInSeconds = signal<number>(0);
	public readonly latestScheduleInSeconds = signal<number>(0);
	public readonly startTimeToDisplay = signal<number>(0); // e.g. 8 (It means: 08:00)
	public readonly endTimeToDisplay = signal<number>(23); // e.g. 20 (It means: 20:00)
	public readonly members = signal<IMember.EntityRaw[]>([]);
	public readonly schedules = signal<ISchedule[]>([]);


	public setEventCalendarWithSpecialistWidgetComponent(value: EventCalendarWithSpecialistWidgetComponent | null) {
		this.eventCalendarWithSpecialistWidgetComponent$.next(value);
		return this;
	}

}
