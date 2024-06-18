import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {ClientState} from "@client/state/client/client.state";
import {Store} from "@ngxs/store";
import {combineLatest, filter, tap} from "rxjs";
import {is} from "thiis";
import {ISchedule, RISchedule} from "@utility/domain/interface/i.schedule";
import {Reactive} from "@utility/cdk/reactive";
import {AsyncPipe, NgIf} from "@angular/common";
import {CalendarWithSpecialistLocaStateService} from "./calendar-with-specialist.loca.state.service";
import {
	CalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/main/calendar-with-specialist.widget.component";

@Component({
	selector: 'app-event-v2-schedule-container-week-calendar-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-container *ngIf="item$ | async">
			<app-calendar-with-specialists-widget-component/>
		</ng-container>
	`,
	imports: [
		NgIf,
		AsyncPipe,
		CalendarWithSpecialistWidgetComponent
	]
})
export class ScheduleV2ContainerWeekCalendarComponent extends Reactive {

	private readonly store = inject(Store);
	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

	public readonly item$ = combineLatest([
		this.store.select(ClientState.earliestScheduleAndLatestSchedule).pipe(
			filter(is.not_null_or_undefined<{ earliestSchedule: RISchedule; latestSchedule: RISchedule; }>),
			tap(({earliestSchedule, latestSchedule}) => {

				this.calendarWithSpecialistLocaStateService.setEarliestScheduleInSeconds(earliestSchedule.startInSeconds);
				this.calendarWithSpecialistLocaStateService.setLatestScheduleInSeconds(latestSchedule.endInSeconds);

			})
		),
		this.store.select(ClientState.schedules).pipe(
			filter(is.not_null_or_undefined<ISchedule[]>),
			tap((schedules) => {
				this.calendarWithSpecialistLocaStateService.setSchedules(schedules);
			})
		)
	]).pipe(
		this.takeUntil(),
	);

}
