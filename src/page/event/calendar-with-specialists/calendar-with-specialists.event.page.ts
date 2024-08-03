import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {
	MembersV2ContainerWeekCalendarComponent
} from "@page/event/calendar-with-specialists/v2/members.container.week-calendar.component";
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
    selector: 'app-event-calendar-with-specialists-page',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
	imports: [
		MembersV2ContainerWeekCalendarComponent
	],
    template: `
			<app-event-v2-members-container-week-calendar-component/>
    `
})
export class CalendarWithSpecialistsEventPage implements OnInit {

	readonly #ngxLogger = inject(NGXLogger);
	readonly #analyticsService = inject(AnalyticsService);

	public ngOnInit(): void {
		this.#ngxLogger.info('CalendarWithSpecialistsEventPage initialized');
		this.#analyticsService.logEvent('event_calendar_with_specialists_page_initialized');
	}
}

export default CalendarWithSpecialistsEventPage;
