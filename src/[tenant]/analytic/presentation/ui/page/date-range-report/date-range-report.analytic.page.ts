import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {Store} from "@ngxs/store";
import {
	DateRangeReportAnalyticActions
} from "@[tenant]/analytic/presentation/store/date-range-report/date-range-report.analytic.actions";
import {
	TotalDateRangeReportSmartAnalyticComponent
} from "@[tenant]/analytic/presentation/component/date-range-report/smart/total/total.date-range-report.smart.analytic.component";

@Component({
	selector: 'date-range-report-analytic-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		TotalDateRangeReportSmartAnalyticComponent
	],
	template: `
		<app-total-date-range-report-smart-analytic-component/>
	`
})
export default class DateRangeReportAnalyticPage implements OnInit {

	private readonly store = inject(Store);

	public ngOnInit() {
		this.store.dispatch(new DateRangeReportAnalyticActions.GetList());
	}

}
