import {Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {NgForOf, NgIf} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {
	DateControlCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.service";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-slot-frame-component',
	template: `

		<!-- Calendar frame -->
		<ng-container *ngFor="let row of rows; let rowIndex = index;">
			<ng-container *ngFor="let column of columnHeaderList; let columnIndex = index;">
				<event-cell-component
					*ngIf="columnIndex !== 0"
					[row]="row"
					[column]="column"
					[rowIndex]="rowIndex"
					[columnIndex]="columnIndex"/>
			</ng-container>
		</ng-container>

		<event-time-line-component
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
export class SlotFrameComponent {

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	@Input()
	public rows!: {
		isFirstOrLastRowOfHour: boolean;
	}[];

	@Input()
	public columnHeaderList!: {
		member: Member.RIMember | null;
	}[];

	public readonly heightPerSlotInPx = this.composeCalendarWithSpecialistsService.heightPerSlotInPx;

	public readonly headerHeightInPx = this.composeCalendarWithSpecialistsService.headerHeightInPx;

	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

	public readonly endTimeToDisplay = this.composeCalendarWithSpecialistsService.endTimeToDisplay;

	@HostBinding()
	public get class() {
		return 'grid absolute top-0 left-0 h-full';
	}

	@HostBinding('style.grid-template-rows')
	public get gridTemplateRows() {
		return `repeat(${this.rows.length}, ${this.heightPerSlotInPx}px)`;
	}

	@HostBinding('style.grid-template-columns')
	public get gridTemplateColumns() {
		return `repeat(${this.columnHeaderList.length - 1}, minmax(100px,200px))`;
	}

	@HostBinding('style.padding-top')
	public get paddingTop() {
		return `${this.headerHeightInPx}px`;
	}

	@HostBinding('style.padding-left')
	public get paddingLeft() {
		return `70px`;
	}

	private readonly dateControlCalendarWithSpecialistsService = inject(DateControlCalendarWithSpecialistsService);

	public get selectedDateIsToday() {
		return this.dateControlCalendarWithSpecialistsService.selectedDateIsToday;
	}

	public get selectedDate() {
		return this.dateControlCalendarWithSpecialistsService.selectedDate;
	}

}
