import {Component, HostBinding, inject, Input, ViewEncapsulation} from "@angular/core";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import * as Member from "@member/domain";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {filter, map, startWith, switchMap} from "rxjs";
import {Store} from "@ngxs/store";
import {is} from "thiis";
import {DateTime} from "luxon";

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
		<event-time-line-component *ngIf="showTimeLine$ | async"/>
	`,
	standalone: true,
	imports: [
		CellComponent,
		NgForOf,
		NgIf,
		TimeLineComponent,
		AsyncPipe
	],
	encapsulation: ViewEncapsulation.None
})
export class SlotFrameComponent {

	@Input()
	public rows!: {
		isFirstOrLastRowOfHour: boolean;
	}[];

	@Input()
	public columnHeaderList!: {
		member: Member.RIMember | null;
	}[];

	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	private readonly store = inject(Store);

	public readonly selectedDate$ = this.store.select(CalendarWithSpecialistsQueries.start);

	public readonly startTimeToDisplay = this.composeCalendarWithSpecialistsService.startTimeToDisplay;

	public readonly endTimeToDisplay = this.composeCalendarWithSpecialistsService.endTimeToDisplay;

	public readonly showTimeLine$ = this.store.select(CalendarWithSpecialistsQueries.isToday).pipe(
		startWith(false),
		filter(is.true),
		switchMap(() => this.selectedDate$),
		map((selectedDate: DateTime) => {
			// Detect if the current time is within the displayed time range
			const now = DateTime.now();
			return now >= selectedDate.set({
				hour: this.startTimeToDisplay,
				minute: 0,
				second: 0,
				millisecond: 0
			}) && now <= selectedDate.set({
				hour: this.endTimeToDisplay,
				minute: 0,
				second: 0,
				millisecond: 0
			});
		})
	);

	public readonly heightPerSlotInPx = this.composeCalendarWithSpecialistsService.heightPerSlotInPx;

	public readonly headerHeightInPx = this.composeCalendarWithSpecialistsService.headerHeightInPx;

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

}
