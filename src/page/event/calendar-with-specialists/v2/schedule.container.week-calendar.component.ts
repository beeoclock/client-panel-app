import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {Store} from "@ngxs/store";
import {combineLatest, filter, tap} from "rxjs";
import {is} from "../../../../../core/shared/checker";
import {ISchedule, RISchedule} from "@utility/domain/interface/i.schedule";
import {Reactive} from "@utility/cdk/reactive";
import {AsyncPipe} from "@angular/common";
import CalendarWithSpecialistLocaStateService from "./calendar-with-specialist.loca.state.service";
import {
	CalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/main/calendar-with-specialist.widget.component";
import {NGXLogger} from "ngx-logger";
import {ClientActions} from "@client/infrastructure/state/client/client.actions";

@Component({
	selector: 'app-event-v2-schedule-container-week-calendar-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (item$ | async) {
			<app-calendar-with-specialists-widget-component/>
		}
	`,
	imports: [
		AsyncPipe,
		CalendarWithSpecialistWidgetComponent
	]
})
export default class ScheduleV2ContainerWeekCalendarComponent extends Reactive implements OnInit {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
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

	public ngOnInit() {
		this.ngxLogger.info('ScheduleV2ContainerWeekCalendarComponent ngOnInit');
		this.store.dispatch(new ClientActions.InitClient());
	}

}
