import {Component, HostBinding, HostListener, inject, Input, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {NgForOf, NgIf} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/date-control/date-control.calendar-with-specialists.service";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";

@Component({
	selector: 'event-background-frame-component',
	template: `

		<!-- Under header and it is like first line of the container -->
		<div class="row-start-1 col-span-8"></div>

		<!-- Calendar frame -->
		<ng-container *ngFor="let row of rows; let rowIndex = index;">
			<event-cell-component
				*ngFor="let column of columnHeaderList; let columnIndex = index;"
				[row]="row"
				[column]="column"
				[rowIndex]="rowIndex"
				[columnIndex]="columnIndex"/>
		</ng-container>

		<event-time-line-component
			[heightInPx]="heightInPx"
			[headerHeightInPx]="headerHeightInPx"
			[startTimeToDisplay]="startTimeToDisplay"
			*ngIf="selectedDateIsToday && selectedDate.hour >= startTimeToDisplay && selectedDate.hour <= endTimeToDisplay"/>

	`,
	standalone: true,
	imports: [
		CellComponent,
		NgForOf,
		NgIf,
		TimeLineComponent
	],
	encapsulation: ViewEncapsulation.None
})
export class BackgroundFrameComponent {

	private readonly scrollCalendarDomManipulationService = inject(ScrollCalendarDomManipulationService);

	@Input()
	public rows!: {
		isFirstOrLastRowOfHour: boolean;
	}[];

	@Input()
	public columnHeaderList!: {
		member: Member.RIMember | null;
	}[];

	@Input()
	public heightInPx!: number;

	@Input()
	public heightPerSlotInPx!: number;

	@Input()
	public headerHeightInPx!: number;

	@Input()
	public startTimeToDisplay!: number;

	@Input()
	public endTimeToDisplay!: number;

	@HostBinding()
	public get class() {
		return 'grid absolute top-0 left-0 h-full';
	}

	@HostBinding('style.grid-template-rows')
	public get gridTemplateRows() {
		return `${this.headerHeightInPx}px repeat(${this.rows.length}, ${this.heightPerSlotInPx}px)`;
	}

	@HostBinding('style.grid-template-columns')
	public get gridTemplateColumns() {
		return `70px repeat(${this.columnHeaderList.length - 1}, minmax(100px,200px))`;
	}

	@HostListener('click', ['$event'])
	public onClick(event: MouseEvent) {
		if (this.scrollCalendarDomManipulationService.isScrolling.isOn) {
			return;
		}
		console.log('BackgroundFrameComponent.onClick', event);
	}

	private readonly dateControlCalendarWithSpecialistsService = inject(DateControlCalendarWithSpecialistsService);

	get selectedDateIsToday() {
		return this.dateControlCalendarWithSpecialistsService.selectedDateIsToday;
	}

	get selectedDate() {
		return this.dateControlCalendarWithSpecialistsService.selectedDate;
	}

}
