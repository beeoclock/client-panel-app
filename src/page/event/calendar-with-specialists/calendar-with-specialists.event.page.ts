import {Component, ViewEncapsulation} from '@angular/core';
import {
    MembersContainerWeekCalendarComponent
} from "@page/event/calendar-with-specialists/component/members.container.week-calendar.component";
import {
    ComposeCalendarWithSpecialistsService
} from "@page/event/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
    selector: 'app-event-calendar-with-specialists-page',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    providers: [
        ComposeCalendarWithSpecialistsService
    ],
    imports: [
        MembersContainerWeekCalendarComponent
    ],
    template: `
        <event-members-container-week-calendar-component/>
    `
})
export default class CalendarWithSpecialistsEventPage {
}
