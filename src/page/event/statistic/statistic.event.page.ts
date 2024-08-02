import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {StatisticComponent} from "@event/presentation/component/statistic/statistic.component";
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@utility/cdk/analytics.service";

@Component({
	selector: 'app-event-statistic-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		StatisticComponent
	],
	template: `
		<event-statistic-component/>
	`
})
export default class StatisticEventPage implements OnInit {

	readonly #ngxLogger = inject(NGXLogger);
	readonly #analyticsService = inject(AnalyticsService);

	public ngOnInit(): void {
		this.#ngxLogger.info('StatisticEventPage initialized');
		this.#analyticsService.logEvent('event_statistic_page_initialized');
	}

}
