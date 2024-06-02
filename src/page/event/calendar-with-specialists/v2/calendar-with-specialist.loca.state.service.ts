import {Injectable} from "@angular/core";
import * as Member from "@member/domain";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {BehaviorSubject} from "rxjs";
import {
    EventCalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/event.calendar-with-specialist.widget.component";

@Injectable({
    providedIn: 'root'
})
export class CalendarWithSpecialistLocaStateService {

    public readonly specialistCellHeightForPx = 50;
    public readonly specialistCellHeightInPx = `${this.specialistCellHeightForPx}px`;

    public readonly oneHourForPx = 120;
    public readonly oneHourInPx = `${this.oneHourForPx}px`;
    public readonly oneMinuteForPx = this.oneHourForPx / 60;

    public readonly hourRowListInPx = Array.from({length: 24}, (_, i) => {
        return {
            original: i,
            // hour format: 00:00
            hour: `${String(i).padStart(2, '0')}:00`,
            isOdd: i % 2 === 1,
            isEven: i % 2 === 0
        }
    });
    public readonly columnHeightForPx = (this.oneHourForPx * 24) + this.specialistCellHeightForPx;
    public readonly columnHeightInPx = `${this.columnHeightForPx}px`;

    public readonly cellWidthInPx = '140px';
    public readonly hoursWidthInPx = '60px';

    public readonly eventCalendarWithSpecialistWidgetComponent$ = new BehaviorSubject<EventCalendarWithSpecialistWidgetComponent | null>(null);

    public setEventCalendarWithSpecialistWidgetComponent(value: EventCalendarWithSpecialistWidgetComponent | null) {
        this.eventCalendarWithSpecialistWidgetComponent$.next(value);
        return this;
    }

    #startTimeToDisplay = 0; // e.g. 8 (It means: 08:00)
    #endTimeToDisplay = 23; // e.g. 20 (It means: 20:00)
    #members : Member.RIMember[] = [];
    #schedules : ISchedule[] = [];

    public get startTimeToDisplay(): number {
        return this.#startTimeToDisplay;
    }

    public setEarliestScheduleToDisplay(value: number) {
        this.#startTimeToDisplay = value;
        return this;
    }

    public get endTimeToDisplay(): number {
        return this.#endTimeToDisplay;
    }

    public setLatestScheduleToDisplay(value: number) {
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

    public get schedules(): ISchedule[] {
        return this.#schedules;
    }

    public setSchedules(value: ISchedule[]) {
        this.#schedules = value;
        return this;
    }


}
