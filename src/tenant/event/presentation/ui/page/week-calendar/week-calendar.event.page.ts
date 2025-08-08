import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {Store} from "@ngxs/store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter} from "rxjs";
import {
	BusinessProfileActions
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.actions";
import {
	CalendarWithSpecialistsAction
} from "@tenant/event/infrastructure/state/calendar-with-specialists/calendar-with-specialists.action";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";
import MembersV3ContainerWeekCalendarComponent from './members.container.week-calendar.component';

@Component({
	selector: 'app-event-week-calendar-page',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		MembersV3ContainerWeekCalendarComponent
	],
	template: `
		<app-event-v3-members-container-week-calendar-component/>
	`
})
export default class CalendarWithSpecialistsEventPage implements OnInit {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly analyticsService = inject(AnalyticsService);

	private preSyncingValue = false;

	public readonly syncAllSubscription = BaseSyncManager.isSyncing$.pipe(
		takeUntilDestroyed(),
		filter((isSyncing) => {
			if (this.preSyncingValue !== !!isSyncing) {
				this.preSyncingValue = !!isSyncing;
				if (!isSyncing) {
					return true;
				}
			}
			return false;
		})
	).subscribe(() => {
		this.store.dispatch([
			new MemberDataActions.GetList(),
			new BusinessProfileActions.Init(),
			new CalendarWithSpecialistsAction.GetItems(),
		])
	});

	public ngOnInit(): void {
		this.ngxLogger.info('CalendarWithSpecialistsEventPage initialized');
		this.analyticsService.logEvent('event_calendar_with_specialists_page_initialized');
	}
}
