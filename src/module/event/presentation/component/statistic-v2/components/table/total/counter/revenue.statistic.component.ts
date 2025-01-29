import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";
import {TranslatePipe} from "@ngx-translate/core";
import {ClientState} from "@client/state/client/client.state";
import {map} from "rxjs";
import {Store} from "@ngxs/store";
import {AsyncPipe, CurrencyPipe} from "@angular/common";

@Component({
	selector: 'revenue-statistic-component',
	template: `
			<div class="uppercase text-neutral-400 flex gap-2">
				<div>
					<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-person-vcard"></i>
				</div>
				<span>
					{{ 'analytic.widget.summary.revenue.by.status.done' | translate }}
				</span>
			</div>
			<div class="rounded-2xl bg-white p-2 flex gap-2 justify-center flex-col text-center">
				<div class="text-2xl font-bold">
					@if (baseCurrency$ | async; as baseCurrency) {
						{{ analytic().summary.revenue.total.by.status.done[baseCurrency] | currency: baseCurrency }}
					}
				</div>
			</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslatePipe,
		AsyncPipe,
		CurrencyPipe
	],
	host: {
		class: 'rounded-2xl bg-neutral-100 p-2 flex flex-col gap-2'
	}
})
export class RevenueStatisticComponent {

	private readonly store = inject(Store);

	public readonly baseCurrency$ = this.store.select(ClientState.item).pipe(
		map((item) => {
			return item?.businessSettings?.baseCurrency;
		})
	);

	public readonly analytic = input.required<Analytic.I | Analytic.ISpecialist>();

}
