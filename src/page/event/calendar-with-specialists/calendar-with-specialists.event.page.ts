import {Component, ViewEncapsulation} from '@angular/core';
import {
	MembersV2ContainerWeekCalendarComponent
} from "@page/event/calendar-with-specialists/v2/members.container.week-calendar.component";

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
export default class CalendarWithSpecialistsEventPage {
}
