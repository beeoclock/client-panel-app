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

	private readonly filterService = inject(FilterService);
	public readonly loading$ = this.filterService.loader.state$;

	public forceRefresh() {
		this.filterService.forceRefresh();
	}


}
