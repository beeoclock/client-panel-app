import {Component, ViewEncapsulation} from '@angular/core';
import {
	WeekCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/week-calendar.component";

@Component({
	selector: 'event-calendar-with-specialists-page',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		WeekCalendarComponent
	],
	template: `
		<event-week-calendar-component/>
	`
})
export default class Index {


}
