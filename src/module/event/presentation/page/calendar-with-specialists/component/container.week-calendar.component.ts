import {Component, inject} from "@angular/core";
import {ClientState} from "@client/state/client/client.state";
import {Store} from "@ngxs/store";
import {filter, map, Observable} from "rxjs";
import {
	WeekCalendarComponent
} from "@event/presentation/page/calendar-with-specialists/component/week-calendar.component";
import * as Client from "@client/domain";
import {is} from "thiis";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
	selector: 'container-week-calendar-component',
	standalone: true,
	template: `
		<ng-container *ngIf="startTimeToDisplay$ | async as startTimeToDisplay">
			<ng-container *ngIf="endTimeToDisplay$ | async as endTimeToDisplay">
				<event-week-calendar-component
					[startTimeToDisplay]="0"
					[endTimeToDisplay]="endTimeToDisplay"/>
			</ng-container>
		</ng-container>
	`,
	imports: [
		WeekCalendarComponent,
		NgIf,
		AsyncPipe
	],
	providers: [
		ClientState
	]
})
export class ContainerWeekCalendarComponent {

	private readonly store = inject(Store);

	public readonly item$ = this.store.select(ClientState.item).pipe(
		filter(is.object_not_empty<Client.RIClient>)
	);

	public readonly startTimeToDisplay$: Observable<number> = this.item$.pipe(
		map((item) => {
			// Find earliest schedule
			const earliestSchedule = item.schedules.reduce((earliest, schedule) => {
				return earliest.startInSeconds < schedule.startInSeconds ? earliest : schedule;
			}, item.schedules[0]);

			return earliestSchedule.startInSeconds / 3600;
		})
	);

	public readonly endTimeToDisplay$: Observable<number> = this.item$.pipe(
		map((item) => {
			// Find latest schedule
			const latestSchedule = item.schedules.reduce((latest, schedule) => {
				return latest.endInSeconds > schedule.endInSeconds ? latest : schedule;
			}, item.schedules[0]);

			return latestSchedule.endInSeconds / 3600;
		})
	);

}
