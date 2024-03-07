import {Component, ViewEncapsulation} from '@angular/core';
import {
	MembersContainerWeekCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/members.container.week-calendar.component";

@Component({
	selector: 'event-calendar-with-specialists-page',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		MembersContainerWeekCalendarComponent
	],
	template: `
		<event-members-container-week-calendar-component/>
	`
})
export default class Index {
}
