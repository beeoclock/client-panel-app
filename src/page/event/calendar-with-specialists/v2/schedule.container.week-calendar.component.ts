import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {Store} from "@ngxs/store";
import {combineLatest, delay, filter, iif, of, switchMap, tap} from "rxjs";
import {is} from "@src/core/shared/checker";
import {ISchedule, RISchedule} from "@utility/domain/interface/i.schedule";
import {Reactive} from "@utility/cdk/reactive";
import {AsyncPipe} from "@angular/common";
import CalendarWithSpecialistLocaStateService from "./calendar-with-specialist.loca.state.service";
import {
	CalendarWithSpecialistWidgetComponent
} from "@page/event/calendar-with-specialists/v2/component/main/calendar-with-specialist.widget.component";
import {NGXLogger} from "ngx-logger";
import {BusinessProfileActions} from "@businessProfile/infrastructure/state/business-profile/business-profile.actions";
import {BusinessProfileState} from "@businessProfile/infrastructure/state/business-profile/business-profile.state";
import {Dispatch} from "@ngxs-labs/dispatch-decorator";

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
export default class ScheduleV2ContainerWeekCalendarComponent extends Reactive implements OnInit {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly calendarWithSpecialistLocaStateService = inject(CalendarWithSpecialistLocaStateService);

	public readonly item$ = this.store.select(BusinessProfileState.item).pipe(
		this.takeUntil(),
		switchMap((item) => {
			return iif(
				() => is.null_or_undefined(item),
				of(item).pipe(
					delay(1_000),
					tap(() => {
						this.initBusinessProfile()
					})
				),
				combineLatest([
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
				])
			);
		})
	);

	public ngOnInit() {
		this.ngxLogger.info('ScheduleV2ContainerWeekCalendarComponent ngOnInit');
		this.initBusinessProfile();
	}

	@Dispatch()
	public initBusinessProfile() {
		return new BusinessProfileActions.Init();
	}

}
