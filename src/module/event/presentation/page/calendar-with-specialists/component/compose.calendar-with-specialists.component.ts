import {Component, inject, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {TimeLineComponent} from "@event/presentation/page/calendar-with-specialists/component/time-line.component";
import {
	HeaderCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/header.calendar.component";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";
import {
	HourCellComponent
} from "@event/presentation/page/calendar-with-specialists/component/hour-cell/hour-cell.component";
import {CellComponent} from "@event/presentation/page/calendar-with-specialists/component/cell/cell.component";
import {
	ContainerCalendarWithSpecialistsComponent
} from "@event/presentation/page/calendar-with-specialists/component/container/container.calendar-with-specialists.component";
import {
	DateControlCalendarWithSpecialistsComponent
} from "@event/presentation/page/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.component";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {FilterService} from "@event/presentation/page/calendar-with-specialists/component/filter/filter.service";

@Component({
	selector: 'event-compose-calendar-with-specialists-component',
	templateUrl: './compose.calendar-with-specialists.component.html',
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
		ContainerCalendarWithSpecialistsComponent,
		DateControlCalendarWithSpecialistsComponent,
		AutoRefreshComponent,
		AsyncPipe
	],
	standalone: true
})
export class ComposeCalendarWithSpecialistsComponent {

	/**
	 * TODO: List
	 * - [ ] Add event to the calendar
	 * - [ ] Remove event from the calendar
	 * - [ ] Edit event from the calendar
	 * - [ ] Add event to the calendar by floating button
	 * - [X] Display members in the calendar like a column
	 * - [ ] Display event details by clicking on the event
	 * - [X] Date picker to select the date (left, right, select)
	 * - [ ] Add filter button to filter the events
	 * - [ ] Add filter control: by status
	 * - [X] Detect startTimeToDisplay and endTimeToDisplay by schedules of company
	 */

	public readonly hoursMode = 24;
	public readonly oneHoursInMinutes = 60; // Don't change this value
	public readonly slotInMinutes = 15;
	public readonly stepPerHour = this.oneHoursInMinutes / this.slotInMinutes;
	public readonly heightInPx = 120;
	public readonly heightPerSlotInPx = 120 / this.stepPerHour;
	public readonly headerHeightInPx = 50;

	private readonly filterService = inject(FilterService);
	public readonly loading$ = this.filterService.loader.state$;

	public forceRefresh() {
		this.filterService.forceRefresh();
	}


}
