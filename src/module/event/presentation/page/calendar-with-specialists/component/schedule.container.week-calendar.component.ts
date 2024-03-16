import {Component, inject} from "@angular/core";
import {ClientState} from "@client/state/client/client.state";
import {Store} from "@ngxs/store";
import {filter, tap} from "rxjs";
import {
	ComposeCalendarWithSpecialistsComponent
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {
	ComposeCalendarWithSpecialistsService
} from "@event/presentation/page/calendar-with-specialists/component/compose.calendar-with-specialists.service";
import {is} from "thiis";
import {RISchedule} from "@utility/domain/interface/i.schedule";

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

	public readonly item$ = this.store.select(ClientState.earliestScheduleAndLatestSchedule).pipe(
		filter(is.not_null<{earliestSchedule: RISchedule; latestSchedule: RISchedule;}>),
		tap(({earliestSchedule, latestSchedule}) => {

			this.composeCalendarWithSpecialistsService.setStartTimeToDisplay(earliestSchedule.startInSeconds / 3600);
			this.composeCalendarWithSpecialistsService.setEndTimeToDisplay(latestSchedule.endInSeconds / 3600);

		})
	);

}
