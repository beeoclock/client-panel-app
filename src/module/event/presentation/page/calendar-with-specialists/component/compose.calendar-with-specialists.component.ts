import {AfterViewInit, Component, ElementRef, inject, ViewChild, ViewEncapsulation} from "@angular/core";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import {
	HeaderCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/header.calendar.component";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import * as Member from "@member/domain";

@Component({
	selector: 'event-compose-calendar-with-specialists-component',
	templateUrl: './compose.calendar-with-specialists.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgForOf,
		NgStyle,
		NgClass,
		NgIf,
		DatePipe,
		TimeLineComponent,
		HeaderCalendarComponent
	],
	standalone: true
})
export class ComposeCalendarWithSpecialistsComponent implements AfterViewInit {

	/**
	 * TODO: List
	 * - [ ] Add event to the calendar
	 * - [ ] Remove event from the calendar
	 * - [ ] Edit event from the calendar
	 * - [ ] Add event to the calendar by floating button
	 * - [X] Display members in the calendar like a column
	 * - [ ] Display event details by clicking on the event
	 * - [ ] Date picker to select the date (left, right, select)
	 * - [ ] Add filter button to filter the events
	 * - [ ] Add filter control: by status
	 * - [X] Detect startTimeToDisplay and endTimeToDisplay by schedules of company
	 */

	@ViewChild('container')
	public container!: ElementRef;

	@ViewChild('frame')
	public frame!: ElementRef;

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	public readonly currentDate = new Date();
	public selectedDate = new Date();

	public columns: number[] = [];

	public readonly hoursMode = 24;
	public readonly oneHoursInMinutes = 60; // Don't change this value
	public readonly slotInMinutes = 15;
	public readonly stepPerHour = this.oneHoursInMinutes / this.slotInMinutes;
	public readonly heightInPx = 120;
	public readonly heightPerSlotInPx = 120 / this.stepPerHour;
	public readonly headerHeightInPx = 50;
	public hours: number[] = [];
	public rows: {
		isFirstOrLastRowOfHour: boolean;
	}[] = [];

	public events: {
		cards: {
			startTime: number;
			durationInMinutes: number;
			column: number;
		}[];
		title: string;
		description: string;
	}[] = [];

	public readonly columnHeaderList: {
		member: Member.RIMember | null;
	}[] = [
		{
			member: null,
		},
	];

	readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;
	readonly endTimeToDisplay = this.composeCalendarWithSpecialistsService.endTimeToDisplay;
	readonly members = this.composeCalendarWithSpecialistsService.members;

	public ngAfterViewInit() {

		this.columnHeaderList.push(...this.members.map((member) => {
			return {
				member,
			};
		}));

		this.hours = Array.from({length: this.hoursMode}, (_, i) => i).filter((i) => i >= this.startTimeToDisplay && i <= this.endTimeToDisplay);
		this.rows = Array.from({length: ((this.endTimeToDisplay - this.startTimeToDisplay) * this.stepPerHour) + this.stepPerHour}, (_, i) => {
			const isFirstOrLastRowOfHour = i === 0 ? false : (i + 1) % this.stepPerHour === 0;
			return {
				isFirstOrLastRowOfHour,
			}
		});

		const gridTemplateColumns = `70px repeat(${this.columnHeaderList.length - 1}, minmax(100px,200px))`;

		if (this.container) {
			const container = this.container.nativeElement as HTMLElement;
			container.style.gridTemplateRows = `${this.headerHeightInPx}px repeat(${this.rows.length}, ${this.heightPerSlotInPx}px)`;
			container.style.gridTemplateColumns = gridTemplateColumns;
		}

		if (this.frame) {
			const frame = this.frame.nativeElement as HTMLElement;
			frame.style.gridTemplateRows = `${this.headerHeightInPx}px repeat(${this.rows.length}, ${this.heightPerSlotInPx}px)`;
			frame.style.gridTemplateColumns = gridTemplateColumns;
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
					durationInMinutes: 1.5 * 60, // 1.5 hours
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
					durationInMinutes: 1 * 60, // 1 hour
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
					durationInMinutes: 2 * 60, // 2 hours,
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
					durationInMinutes: 1 * 60, // 1 hour,
					column: 4
				}
			]
		});
		this.events.push({
			title: 'Event 5',
			description: 'Description 5',
			cards: [
				{
					startTime: 16, // 22:00
					durationInMinutes: 1 * 60, // 1 hour,
					column: 5
				}
			]
		});
		this.events.push({
			title: 'Event 6',
			description: 'Description 6',
			cards: [
				{
					startTime: 18, // 00:00
					durationInMinutes: 1 * 60, // 1 hour,
					column: 6
				}
			]
		});
		this.events.push({
			title: 'Event 7',
			description: 'Description 7',
			cards: [
				{
					startTime: 20, // 02:00
					durationInMinutes: 1 * 60, // 1 hour,
					column: 7
				}
			]
		});
		this.events.push({
			title: 'Event 8',
			description: 'Description 8',
			cards: [
				{
					startTime: 16, // 04:00
					durationInMinutes: 1 * 60, // 1 hour,
					column: 8
				}
			]
		});
		this.events.push({
			title: 'Event 9',
			description: 'Description 8',
			cards: [
				{
					startTime: 22, // 04:00
					durationInMinutes: 1 * 60, // 1 hour,
					column: 8
				}
			]
		});
		this.events = this.events.filter((event) => {
			// Filter events by available columns
			return event.cards.every((card) => {
				return card.column < this.columnHeaderList.length;
			});
		}).filter((event) => {
			return event.cards.every((card) => {
				return card.startTime >= this.startTimeToDisplay && card.startTime <= this.endTimeToDisplay;
			});
		});
	}

}
