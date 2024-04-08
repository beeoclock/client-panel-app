import {Component, ViewEncapsulation} from '@angular/core';
import {
	MembersContainerWeekCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/members.container.week-calendar.component";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-calendar-with-specialists-page',
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
export default class Index {
}
