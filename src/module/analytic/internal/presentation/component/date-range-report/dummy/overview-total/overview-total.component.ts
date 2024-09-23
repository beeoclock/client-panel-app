import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";
import {
	CardOverviewComponent
} from "@module/analytic/internal/presentation/component/date-range-report/dummy/overview-total/card/card.overview.component";

@Component({
	selector: 'overview-total',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		TranslateModule,
		CardOverviewComponent
	],
	template: `
		<!-- Card Section -->
		<div class="max-w-[85rem] p-2 mx-auto">
			<!-- Grid -->
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
				@if (revenue) {
					<card-overview
						[label]="'statistic.global.revenue' | translate "
						[value]="revenue"/>
				}
			</div>
			<!-- End Grid -->
		</div>
		<!-- End Card Section -->
    `
})
export class OverviewTotalComponent {
	@Input()
	public revenue: string | null = null;
}
