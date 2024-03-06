import {Component, ViewEncapsulation} from '@angular/core';
import {
	ContainerWeekCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/container.week-calendar.component";

@Component({
	selector: 'event-calendar-with-specialists-page',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		ContainerWeekCalendarComponent
	],
	template: `
		<container-week-calendar-component/>
	`
})
export default class Index {


}
