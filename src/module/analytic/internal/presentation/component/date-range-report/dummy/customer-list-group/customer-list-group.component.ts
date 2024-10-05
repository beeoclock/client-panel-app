import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";
import {TranslateModule} from "@ngx-translate/core";
import {CurrencyPipe} from "@angular/common";
import {CurrencyCodeEnum} from "@utility/domain/enum";

type T = Analytic.ICustomer | Omit<Analytic.ICustomer, 'specialistRecord'>;

@Component({
	selector: 'customer-list-group',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@if (customerList.length) {
			<div class="rounded-lg bg-gray-200">
				<div class="p-2 font-bold rounded-t-lg flex flex-col justify-between">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
							{{ 'analytic.counter.customers' | translate }}
						</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
							{{ customerList.length }}
						</h3>
					</div>
				</div>
				<ul class="flex flex-col max-h-96 overflow-auto divide-y bg-white border border-gray-200 rounded-lg">
					@for (customer of customerList; track customer.details.id; let index = $index) {
						<li
							class="flex flex-col items-start justify-center gap-x-2 py-3 px-4 text-sm font-medium text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
							<div>
								{{ customer.details.firstName }}
								{{ customer.details.lastName }}
							</div>
							<div class="flex flex-wrap gap-2">
								<div
									id="customer-summary-revenue-total-by-status-done-{{ index }}"
									[title]="'analytic.summary.income' | translate"
									class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
									{{ customer.summary.revenue.total.by.status.done | currency: baseCurrency: 'symbol-narrow' }}
								</div>
								<div
									id="customer-summary-revenue-average-by-status-done-{{ index }}"
									[title]="'analytic.summary.averageBill' | translate"
									class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400">
									{{ customer.summary.revenue.average.by.status.done | currency: baseCurrency: 'symbol-narrow' }}
								</div>
								<div
									id="customer-counter-orders-by-status-done-{{ index }}"
									[title]="'analytic.summary.totalOrders' | translate"
									class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-gray-100 text-gray-800 rounded-md dark:bg-neutral-500/20 dark:text-neutral-400">
									<i class="bi bi-receipt"></i>
									{{ customer.counter.orders.by.status.done}}
								</div>
							</div>
						</li>
					}
				</ul>
			</div>
		}
	`,
	imports: [
		TranslateModule,
		CurrencyPipe
	],
	host: {
		class: 'w-full md:max-w-xs'
	}
})
export class CustomerListGroupComponent implements OnChanges {

	@Input({required: true})
	public customerReport!: {
		[customerId: string]: T;
	};

	@Input({required: true})
	public baseCurrency!: CurrencyCodeEnum;

	public readonly customerList: T[] = [];

	public ngOnChanges(changes: SimpleChanges & {
		customerReport?: {
			[customerId: string]: T;
		}
	}): void {
		if (changes.customerReport) {
			this.buildCustomerList();
		}
	}

	private buildCustomerList(): void {
		this.customerList.length = 0;
		Object.keys(this.customerReport).forEach((customerId) => {
			const customer = this.customerReport?.[customerId];
			if (!customer?.details?.firstName?.length) {
				return;
			}
			if (!customer.summary.revenue.total.by.status.done) {
				return;
			}
			this.customerList.push(this.customerReport[customerId]);
		});
		// Sort by revenue
		this.customerList.sort((a, b) => b.summary.revenue.total.by.status.done - a.summary.revenue.total.by.status.done);
	}

}
