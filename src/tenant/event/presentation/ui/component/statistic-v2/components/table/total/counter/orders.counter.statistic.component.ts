import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {Analytic} from "@tenant/analytic/presentation/store/date-range-report/interface/i.analytic";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
	selector: 'orders-counter-statistic-component',
	template: `

			<div class="uppercase text-neutral-400 flex gap-2">
				<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-cart"></i>
				<span>
					{{ 'analytic.widget.total.counter.orders.title' | translate }}
				</span>
			</div>
			<div class="rounded-2xl bg-white p-2 flex gap-2 justify-center flex-col text-center">
				<div class="text-2xl font-bold">{{ analytic().counter.orders.total }}</div>
				<div class="text-neutral-500 text-sm">
					@if (analytic().counter.orders.total === analytic().counter.orderService.total) {
						{{ 'analytic.widget.total.counter.orders.case.ordersLessThanOrderServices.0' | translate }}
					} @else {
						{{ 'analytic.widget.total.counter.orders.case.ordersLessThanOrderServices.1' | translate }}
					}
				</div>
			</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslatePipe
	],
	host: {
		class: 'rounded-2xl bg-neutral-100 p-2 flex flex-col gap-2'
	}
})
export class OrdersCounterStatisticComponent {

	public readonly analytic = input.required<Analytic.I | Analytic.ISpecialist>();

}
