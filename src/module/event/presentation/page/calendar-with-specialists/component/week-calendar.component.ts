import {AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from "@angular/core";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";

@Component({
	selector: 'event-week-calendar-component',
	templateUrl: './week-calendar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		NgStyle,
		NgClass,
		NgIf
	],
	standalone: true
})
export class WeekCalendarComponent implements AfterViewInit {

	@ViewChild('container')
	public container!: ElementRef;

	@ViewChild('containerOfData')
	public containerOfData!: ElementRef;

	public readonly startTimeToDisplay = 0;
	public readonly endTimeToDisplay = 24;

	public readonly columnsAmount = 8;
	public readonly columns = Array.from({length: this.columnsAmount}, (_, i) => i)

	public readonly hoursMode = 24;
	public readonly oneHoursInMinutes = 60; // Don't change this value
	public readonly slotInMinutes = 30;
	public readonly stepPerHour = this.oneHoursInMinutes / this.slotInMinutes;
	public readonly heightInPx = 60 / this.stepPerHour;
	public readonly hours = Array.from({length: this.hoursMode}, (_, i) => i).filter((i) => i >= this.startTimeToDisplay && i <= this.endTimeToDisplay);
	public readonly rows = Array.from({length: this.hoursMode * this.stepPerHour + 1}, (_, i) => i)
		.filter((i) => i >= (this.startTimeToDisplay * this.stepPerHour) && i <= ((this.endTimeToDisplay * this.stepPerHour) + (this.stepPerHour - 1)));

	public readonly events: {
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
			container.style.gridTemplateRows = `50px repeat(${this.rows.length}, ${this.heightInPx}px)`;
		}
		if (this.containerOfData) {
			const containerOfData = this.containerOfData.nativeElement as HTMLElement;
			containerOfData.style.gridTemplateRows = `50px repeat(${this.rows.length}, ${this.heightInPx}px)`;
		}
		this.initEvents();
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
	}

}
