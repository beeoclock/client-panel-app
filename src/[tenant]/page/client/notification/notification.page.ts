import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
	selector: 'client-notification-page',
	templateUrl: './notification.page.html',
	encapsulation: ViewEncapsulation.None,
	imports: [],
	standalone: true
})
export class NotificationPage implements OnInit {

	public readonly analyticsService = inject(AnalyticsService);

	public ngOnInit(): void {

		this.analyticsService.logEvent('notification_page_initialized');

	}


}

export default NotificationPage;
