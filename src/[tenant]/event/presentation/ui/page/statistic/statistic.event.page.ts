import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {AnalyticsService} from "@utility/cdk/analytics.service";
import {StatisticV2Component} from "@[tenant]/event/presentation/ui/component/statistic-v2/statistic-v2.component";
import {Store} from "@ngxs/store";
import {
	DateRangeReportAnalyticActions
} from "@[tenant]/analytic/presentation/store/date-range-report/date-range-report.analytic.actions";

@Component({
	selector: 'app-event-statistic-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		StatisticV2Component
	],
	template: `
		<!--		<event-statistic-component/>-->
		<event-statistic-v2-component/>
	`
})
export default class StatisticEventPage implements OnInit {

	readonly #ngxLogger = inject(NGXLogger);
	readonly #analyticsService = inject(AnalyticsService);
	private readonly store = inject(Store);

	public ngOnInit(): void {
		this.#ngxLogger.info('StatisticEventPage initialized');
		this.#analyticsService.logEvent('event_statistic_page_initialized');
		this.store.dispatch(new DateRangeReportAnalyticActions.GetList());
	}

}
