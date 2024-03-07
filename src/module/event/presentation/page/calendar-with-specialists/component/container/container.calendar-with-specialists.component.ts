import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	ViewChild,
	ViewEncapsulation
} from "@angular/core";
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import {
	HeaderCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/header.calendar.component";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import * as Member from "@member/domain";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";
import {
	DateControlCalendarWithSpecialistsComponent
} from "@event/presentation/page/calendar-with-specialists/component/date-control/date-control.calendar-with-specialists.component";
import {
	EventCardComponent
} from "@event/presentation/page/calendar-with-specialists/component/event-card/event-card.component";
import {
	HourCellComponent
} from "@event/presentation/page/calendar-with-specialists/component/hour-cell/hour-cell.component";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {
	BackgroundFrameComponent
} from "@event/presentation/page/calendar-with-specialists/component/container/background-frame.component";

@Component({
	selector: 'event-container-calendar-with-specialists-component',
	templateUrl: './container.calendar-with-specialists.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [
		ScrollCalendarDomManipulationService
	],
	imports: [
		NgForOf,
		NgStyle,
		NgClass,
		NgIf,
		DatePipe,
		TimeLineComponent,
		HeaderCalendarComponent,
		DateControlCalendarWithSpecialistsComponent,
		EventCardComponent,
		HourCellComponent,
		CellComponent,
		BackgroundFrameComponent
	],
	standalone: true
})
export class ContainerCalendarWithSpecialistsComponent implements AfterViewInit {

	@ViewChild('frame')
	public frame!: ElementRef;

	@HostBinding()
	public get class() {
		return 'bg-white grid relative h-[calc(100vh-114px)] md:h-[calc(100vh-50px)] overflow-auto';
	}

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);
	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

	private readonly elementRef = inject(ElementRef);

	public columns: number[] = [];

	@Input()
	public hoursMode!: number;

	@Input()
	public oneHoursInMinutes!: number; // Don't change this value

	@Input()
	public slotInMinutes!: number;

	@Input()
	public stepPerHour!: number;

	@Input()
	public heightInPx!: number;

	@Input()
	public heightPerSlotInPx!: number;

	@Input()
	public headerHeightInPx!: number;


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

	@HostBinding('style.grid-template-columns')
	public get gridTemplateColumns() {
		return `70px repeat(${this.columnHeaderList.length - 1}, minmax(100px,200px))`;
	}

	@HostBinding('style.grid-template-rows')
	public get gridTemplateRows() {
		return `${this.headerHeightInPx}px repeat(${this.rows.length}, ${this.heightPerSlotInPx}px)`;
	}

	public ngAfterViewInit() {

		this.scrollCalendarDomManipulationService.setNativeElement(this.elementRef.nativeElement as HTMLDivElement).initDesktopMouseHandle().then();

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
