import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {Store} from "@ngxs/store";
import {combineLatest, filter, map, switchMap, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {ISchedule, RISchedule} from "@utility/domain/interface/i.schedule";
import {AsyncPipe} from "@angular/common";
import CalendarWithSpecialistLocaStateService from "./calendar-with-specialist.loca.state.service";
import {
	CalendarWithSpecialistWidgetComponent
} from "@[tenant]/event/presentation/ui/page/calendar-with-specialists/v2/component/main/calendar-with-specialist.widget.component";
import {NGXLogger} from "ngx-logger";
import {
	BusinessProfileState
} from "@[tenant]/business-profile/presentation/state/business-profile/business-profile.state";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
	selector: 'app-event-v2-schedule-container-week-calendar-component',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (item$ | async) {
			<app-calendar-with-specialists-widget-component/>
		} @else {
			Loading...
		}
	`,
	imports: [
		AsyncPipe,
		CalendarWithSpecialistWidgetComponent
	]
})
export default class ScheduleV2ContainerWeekCalendarComponent {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

	public readonly item$ = this.store.select(BusinessProfileState.item).pipe(
		takeUntilDestroyed(),
		filter(is.object_not_empty),
		switchMap((item) => combineLatest([
			this.store.select(BusinessProfileState.earliestScheduleAndLatestSchedule).pipe(
				filter(is.not_null_or_undefined<{ earliestSchedule: RISchedule; latestSchedule: RISchedule; }>),
				tap(({earliestSchedule, latestSchedule}) => {

					this.calendarWithSpecialistLocaStateService.setEarliestScheduleInSeconds(earliestSchedule.startInSeconds);
					this.calendarWithSpecialistLocaStateService.setLatestScheduleInSeconds(latestSchedule.endInSeconds);

				})
			),
			this.store.select(BusinessProfileState.schedules).pipe(
				filter(is.not_null_or_undefined<ISchedule[]>),
				tap((schedules) => {
					this.calendarWithSpecialistLocaStateService.setSchedules(schedules);
				})
			)
		]).pipe(map(() => item)))
	);

}
