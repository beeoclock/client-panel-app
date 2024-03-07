import {Component, inject} from "@angular/core";
import {ClientState} from "@client/state/client/client.state";
import {Store} from "@ngxs/store";
import {filter, tap} from "rxjs";
import {
	ComposeCalendarWithSpecialistsComponent
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.component";
import * as Client from "@client/domain";
import {is} from "thiis";
import {AsyncPipe, NgIf} from "@angular/common";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";

@Component({
	selector: 'event-schedule-container-week-calendar-component',
	standalone: true,
	template: `
		<ng-container *ngIf="item$ | async">
			<event-compose-calendar-with-specialists-component/>
		</ng-container>
	`,
	imports: [
		ComposeCalendarWithSpecialistsComponent,
		NgIf,
		AsyncPipe
	]
})
export class ScheduleContainerWeekCalendarComponent {

	private readonly store = inject(Store);
	private readonly composeCalendarWithSpecialistsService = inject(ComposeCalendarWithSpecialistsService);

	public readonly item$ = this.store.select(ClientState.item).pipe(
		filter(is.object_not_empty<Client.RIClient>),
		tap((item) => {

			// Find earliest schedule and latest schedule
			const {earliestSchedule, latestSchedule} = item.schedules
				.reduce(({earliestSchedule, latestSchedule}, schedule) => {
					return {
						earliestSchedule: earliestSchedule.startInSeconds < schedule.startInSeconds ? earliestSchedule : schedule,
						latestSchedule: latestSchedule.endInSeconds > schedule.endInSeconds ? latestSchedule : schedule
					};
				}, {earliestSchedule: item.schedules[0], latestSchedule: item.schedules[0]});

			this.composeCalendarWithSpecialistsService.setStartTimeToDisplay(earliestSchedule.startInSeconds / 3600);
			this.composeCalendarWithSpecialistsService.setEndTimeToDisplay(latestSchedule.endInSeconds / 3600);

		})
	);

}
