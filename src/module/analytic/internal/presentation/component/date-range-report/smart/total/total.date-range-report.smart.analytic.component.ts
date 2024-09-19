import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {Store} from "@ngxs/store";
import {
	DateRangeReportAnalyticState
} from "@module/analytic/internal/store/date-range-report/date-range-report.analytic.state";
import {AsyncPipe, CurrencyPipe, KeyValuePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {SelectSnapshot} from "@ngxs-labs/select-snapshot";
import {ClientState} from "@client/state/client/client.state";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

@Component({
	standalone: true,
	selector: 'app-total-date-range-report-smart-analytic-component',
	templateUrl: './total.date-range-report.smart.analytic.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		TranslateModule,
		CurrencyPipe,
		HumanizeDurationPipe,
		KeyValuePipe
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TotalDateRangeReportSmartAnalyticComponent {

	private readonly store = inject(Store);
	public readonly analytic$ = this.store.select(DateRangeReportAnalyticState.analytic);

	@SelectSnapshot(ClientState.baseCurrency)
	public baseCurrency!: CurrencyCodeEnum;

}
