import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@core/cdk/analytics.service";
import {Store} from "@ngxs/store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {filter} from "rxjs";
import {
	BusinessProfileActions
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.actions";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";
import MembersV3ContainerWeekCalendarComponent from './members.container.week-calendar.component';
import {SyncManager} from "@core/system/infrastructure/sync-manager/sync-manager";
import { WeekCalendarAction } from '@src/tenant/event/infrastructure/state/week-calendar/week-calendar.action';

@Component({
	selector: 'app-event-week-calendar-page',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		MembersV3ContainerWeekCalendarComponent
	],
	template: `
		<app-event-members-container-week-calendar-component/>
	`
})
export default class WeekCalendarEventPage implements OnInit {

	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly analyticsService = inject(AnalyticsService);

	private preSyncingValue = false;

	public readonly syncAllSubscription = SyncManager.isSyncing$.pipe(
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
			new WeekCalendarAction.GetItems(),
		])
	});

	public ngOnInit(): void {
		this.ngxLogger.info('WeekCalendarEventPage initialized');
		this.analyticsService.logEvent('event_week_calendar_page_initialized');
	}
}
