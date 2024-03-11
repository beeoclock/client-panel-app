import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	inject,
	Input,
	OnInit,
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
	HourCellComponent
} from "@event/presentation/page/calendar-with-specialists/component/hour-cell/hour-cell.component";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {
	SlotFrameComponent
} from "@event/presentation/page/calendar-with-specialists/component/container/slot-frame.component";
import {
	DataFrameComponent
} from "@event/presentation/page/calendar-with-specialists/component/container/data-frame.component";

@Component({
	selector: 'event-container-calendar-with-specialists-component',
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
		HourCellComponent,
		CellComponent,
		SlotFrameComponent,
		DataFrameComponent
	],
	standalone: true,
	template: `

		<event-data-frame-component
			[slotInMinutes]="slotInMinutes"
			[stepPerHour]="stepPerHour"
			[rows]="rows"
			[columnHeaderList]="columnHeaderList"
			[heightInPx]="heightInPx"
			[heightPerSlotInPx]="heightPerSlotInPx"
			[headerHeightInPx]="headerHeightInPx"
			[endTimeToDisplay]="endTimeToDisplay"
			[startTimeToDisplay]="startTimeToDisplay"/>

		<event-slot-frame-component
			[rows]="rows"
			[columnHeaderList]="columnHeaderList"
			[heightInPx]="heightInPx"
			[heightPerSlotInPx]="heightPerSlotInPx"
			[headerHeightInPx]="headerHeightInPx"
			[endTimeToDisplay]="endTimeToDisplay"
			[startTimeToDisplay]="startTimeToDisplay"/>

		<event-hour-cell-component
			*ngFor="let hour of hours; let index = index;"
			[stepPerHour]="stepPerHour"
			[index]="index"
			[hour]="hour"/>

		<event-header-calendar-component
			*ngFor="let columnHeader of columnHeaderList; let columnIndex = index;"
			[columnIndex]="columnIndex"
			[member]="columnHeader.member"/>

	`
})
export class ContainerCalendarWithSpecialistsComponent implements AfterViewInit, OnInit {

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

	public ngOnInit() {

		this.columnHeaderList.push(...this.members.map((member) => {
			return {
				member,
			};
		}));
	}

	public ngAfterViewInit() {

		this.scrollCalendarDomManipulationService.setNativeElement(this.elementRef.nativeElement as HTMLDivElement).initDesktopMouseHandle().then();

		this.hours = Array.from({length: this.hoursMode}, (_, i) => i).filter((i) => i >= this.startTimeToDisplay && i <= this.endTimeToDisplay);
		this.rows = Array.from({length: ((this.endTimeToDisplay - this.startTimeToDisplay) * this.stepPerHour) + this.stepPerHour}, (_, i) => {
			const isFirstOrLastRowOfHour = i === 0 ? false : (i + 1) % this.stepPerHour === 0;
			return {
				isFirstOrLastRowOfHour,
			}
		});

	}

}
