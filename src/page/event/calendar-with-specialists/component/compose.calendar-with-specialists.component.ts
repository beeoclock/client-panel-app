import {Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {
	ScrollCalendarDomManipulationService
} from "@event/presentation/dom-manipulation-service/scroll.calendar.dom-manipulation-service";
import {AutoRefreshComponent} from "@utility/presentation/component/auto-refresh/auto-refresh.component";
import {ActivatedRoute} from "@angular/router";
import {Reactive} from "@src/module/utility/cdk/reactive";
import {Store} from "@ngxs/store";
import {CalendarWithSpecialistsQueries} from "@event/state/calendar-with-specialists/calendar–with-specialists.queries";
import {CalendarWithSpecialistsAction} from "@event/state/calendar-with-specialists/calendar-with-specialists.action";
import {TimeLineComponent} from "@page/event/calendar-with-specialists/component/time-line.component";
import {HeaderCalendarComponent} from "@page/event/calendar-with-specialists/component/header.calendar.component";
import {HourCellComponent} from "@page/event/calendar-with-specialists/component/hour-cell/hour-cell.component";
import {
	ContainerCalendarWithSpecialistsComponent
} from "@page/event/calendar-with-specialists/component/container/container.calendar-with-specialists.component";
import {
	DateControlCalendarWithSpecialistsComponent
} from "@page/event/calendar-with-specialists/component/filter/date-control/date-control.calendar-with-specialists.component";
import {CellComponent} from "@page/event/calendar-with-specialists/component/cell/cell.component";

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
export class ComposeCalendarWithSpecialistsComponent extends Reactive implements OnInit {

	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly store = inject(Store);

	public readonly loader$ = this.store.select(CalendarWithSpecialistsQueries.loader);

	public ngOnInit() {

		this.detectDateInQueryParams();

	}

	public async forceRefresh() {

		this.store.dispatch(new CalendarWithSpecialistsAction.GetItems());

	}

	private detectDateInQueryParams() {
		const {date} = this.activatedRoute.snapshot.queryParams;

		if (!date) {
			this.forceRefresh().then();
			return;
		}

		this.store.dispatch(new CalendarWithSpecialistsAction.SetDate({
			date
		}));
	}


}
