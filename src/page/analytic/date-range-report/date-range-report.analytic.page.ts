import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {Store} from "@ngxs/store";
import {
	DateRangeReportAnalyticActions
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.actions";

@Component({
	selector: 'date-range-report-analytic-page',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	template: `
	`
})
export default class DateRangeReportAnalyticPage implements OnInit {

	private readonly store = inject(Store);

	public ngOnInit() {
		this.store.dispatch(new DateRangeReportAnalyticActions.GetList());
	}

}
