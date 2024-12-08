import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, KeyValuePipe} from "@angular/common";
import {
	StatusIconComponent
} from "@page/event/calendar-with-specialists/v2/component/elements-on-calendar/icon/status.icon.component";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";

@Component({
	selector: 'counter-statistic-component',
	template: `
		@if (counter) {
			<div class="rounded-2xl bg-neutral-100 p-2">
				<div class="uppercase text-neutral-400">
					Counter
				</div>
				<div class="rounded-2xl bg-white p-2 flex flex-wrap gap-2 justify-center">
					<div class="flex items-center justify-center gap-2 p-2 w-full">
						<div class="border p-2 rounded-2xl text-2xl">
							<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-cart"></i>
							<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-emoji-smile"></i>
						</div>
						<div>
							{{ counter.orderService.total }}
						</div>
					</div>
					<div class="flex items-center justify-center gap-2 p-2">
						<div class="border p-2 rounded-2xl text-2xl">
							<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-cart"></i>
						</div>
						<div>
							{{ counter.orders.total }}
						</div>
					</div>
					<div class="flex items-center justify-center gap-2 p-2">
						<div class="border p-2 rounded-2xl text-2xl">
							<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-emoji-smile"></i>
						</div>
						<div>
							{{ counter.services }}
						</div>
					</div>
					<div class="flex items-center justify-center gap-2 p-2">
						<div class="border p-2 rounded-2xl text-2xl">
							<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-person-vcard"></i>
						</div>
						<div>
							{{ counter.customers }}
						</div>
					</div>
<!--					<div class="flex items-center justify-center gap-2 p-2">-->
<!--						<div class="border p-2 rounded-2xl text-2xl">-->
<!--							<i class="w-6 h-6 ms-1 text-beeColor-500 transition duration-75 dark:text-beeDarkColor-400 group-hover:text-beeColor-900 dark:group-hover:text-white bi bi-people"></i>-->
<!--						</div>-->
<!--						<div>-->
<!--							{{ counter.specialists }}-->
<!--						</div>-->
<!--					</div>-->
				</div>
			</div>
		}
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		KeyValuePipe,
		CurrencyPipe,
		StatusIconComponent
	]
})
export class CounterStatisticComponent {

	@Input({required: true})
	counter!: Omit<Analytic.ICounter, 'specialists'>;


}
