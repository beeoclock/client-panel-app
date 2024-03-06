import {AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from "@angular/core";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
	selector: 'event-week-calendar-component',
	templateUrl: './week-calendar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		NgStyle,
		NgClass,
		NgIf,
		DatePipe
	],
	standalone: true
})
export class WeekCalendarComponent implements AfterViewInit {

	/**
	 * TODO: List
	 * - [ ] Add event to the calendar
	 * - [ ] Remove event from the calendar
	 * - [ ] Edit event from the calendar
	 * - [ ] Add event to the calendar by floating button
	 * - [ ] Display members in the calendar like a column
	 * - [ ] Display event details by clicking on the event
	 * - [ ] Date picker to select the date (left, right, select)
	 * - [ ] Add filter button to filter the events
	 * - [ ] Add filter control: by status
	 * - [ ] Detect startTimeToDisplay and endTimeToDisplay by schedules of company
	 */

	@ViewChild('container')
	public container!: ElementRef;

	@ViewChild('frame')
	public frame!: ElementRef;

	public currentDate = new Date();
	public selectedDate = new Date();

	public readonly startTimeToDisplay = 0;
	public readonly endTimeToDisplay = 23;

	public readonly columnsAmount = 8;
	public readonly columns = Array.from({length: this.columnsAmount}, (_, i) => i)

	public readonly hoursMode = 24;
	public readonly oneHoursInMinutes = 60; // Don't change this value
	public readonly slotInMinutes = 30;
	public readonly stepPerHour = this.oneHoursInMinutes / this.slotInMinutes;
	public readonly heightInPx = 60 / this.stepPerHour;
	public readonly headerHeightInPx = 50;
	public readonly hours = Array.from({length: this.hoursMode}, (_, i) => i).filter((i) => i >= this.startTimeToDisplay && i <= this.endTimeToDisplay);
	public readonly rows = Array.from({length: ((this.endTimeToDisplay - this.startTimeToDisplay) * this.stepPerHour) + 2}, (_, i) => i);

	public events: {
		cards: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		}[];
		title: string;
		description: string;
	}[] = [];

	public readonly columnHeader = ['Hours', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	public ngAfterViewInit() {
		if (this.container) {
			const container = this.container.nativeElement as HTMLElement;
			container.style.gridTemplateRows = `${this.headerHeightInPx}px repeat(${this.rows.length}, ${this.heightInPx}px)`;
		}
		if (this.frame) {
			const frame = this.frame.nativeElement as HTMLElement;
			frame.style.gridTemplateRows = `${this.headerHeightInPx}px repeat(${this.rows.length}, ${this.heightInPx}px)`;
		}
		this.initEvents();
		this.initInterval();
	}

	public initInterval() {
		const interval = setInterval(() => {
			this.currentDate = new Date();
		}, 1000);
	}

	public initEvents() {
		this.events.push({
			title: 'Event 1',
			description: 'Description 1',
			cards: [
				{
					startTime: 8, // 14:00
					durationInMinutes: 1.5*60, // 1.5 hours
					column: 2
				}
			]
		});
		this.events.push({
			title: 'Event 2',
			description: 'Description 2',
			cards: [
				{
					startTime: 10, // 16:00
					durationInMinutes: 1*60, // 1 hour
					column: 3
				}
			]
		});
		this.events.push({
			title: 'Event 3',
			description: 'Description 3',
			cards: [
				{
					startTime: 12, // 18:00
					durationInMinutes: 2*60, // 2 hours,
					column: 4
				}
			]
		});
		this.events.push({
			title: 'Event 4',
			description: 'Description 4',
			cards: [
				{
					startTime: 14, // 20:00
					durationInMinutes: 1*60, // 1 hour,
					column: 4
				}
			]
		});
		this.events = this.events.filter((event) => {
			return event.cards.every((card) => {
				return card.startTime >= this.startTimeToDisplay && card.startTime <= this.endTimeToDisplay;
			});
		});
	}

}
