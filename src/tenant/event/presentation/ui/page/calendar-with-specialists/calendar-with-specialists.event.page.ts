import {Component, inject, input, OnInit, ViewEncapsulation} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@core/cdk/analytics.service";
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
import {SyncManager} from "@core/system/infrastructure/sync-manager/sync-manager";
import {
	CalendarWithSpecialistWidgetComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v3/component/main/calendar-with-specialist.widget.component";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";

@Component({
	selector: 'app-event-calendar-with-specialists-page',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CalendarWithSpecialistWidgetComponent
	],
	template: `
		<app-calendar-with-specialists-widget-component [start]="start()" [statuses]="statuses()"/>
	`
})
export default class CalendarWithSpecialistsEventPage implements OnInit {

	public readonly start = input<string>();
	public readonly statuses = input<OrderServiceStatusEnum[]>();

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
			new CalendarWithSpecialistsAction.GetItems(),
		])
	});

	public ngOnInit(): void {
		this.ngxLogger.info('CalendarWithSpecialistsEventPage initialized');
		this.analyticsService.logEvent('event_calendar_with_specialists_page_initialized');
	}
}
