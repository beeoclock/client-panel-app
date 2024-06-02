import {Component, ViewEncapsulation} from '@angular/core';
import {
    ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {
    MembersV2ContainerWeekCalendarComponent
} from "@page/event/calendar-with-specialists/v2/members.container.week-calendar.component";

@Component({
    selector: 'app-event-calendar-with-specialists-page',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    providers: [
        ComposeCalendarWithSpecialistsService
    ],
	imports: [
		MembersV2ContainerWeekCalendarComponent
	],
    template: `
			<app-event-v2-members-container-week-calendar-component/>
    `
})
export default class CalendarWithSpecialistsEventPage {
}
