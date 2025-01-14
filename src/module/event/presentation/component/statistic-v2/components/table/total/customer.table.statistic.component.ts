import {ChangeDetectionStrategy, Component, input, OnChanges, ViewEncapsulation} from "@angular/core";
import {Analytic} from "@module/analytic/internal/store/date-range-report/interface/i.analytic";
import {TranslatePipe} from "@ngx-translate/core";
import {CurrencyPipe, DatePipe, KeyValuePipe} from "@angular/common";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

@Component({
	selector: 'customer-table-statistic-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		TranslatePipe,
		DatePipe,
		HumanizeDurationPipe,
		CurrencyPipe,
		KeyValuePipe
	],
	host: {
		class: 'w-full'
	},
	template: `
		<div class="flex flex-col rounded-2xl bg-neutral-100 p-2">
			<div class="pb-2 text-lg text-neutral-400">
				{{ 'sidebar.customers' | translate }}
			</div>
			<div class="overflow-x-auto">
				<div class="min-w-full inline-block align-middle">
					<div
						class="border rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700 bg-white">
						<!--						<div class="py-3 px-4">-->
						<!-- TODO: Filter -->
						<!--						</div>-->
						<div class="overflow-hidden ">
							<table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
								<thead class="bg-gray-50 dark:bg-neutral-700">
								<tr>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Full name
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										With you since
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Service time
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Total revenue by status done
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Average revenue by status done
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Order services
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Orders
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Specialists
									</th>
									<th scope="col"
										class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">
										Services
									</th>
								</tr>
								</thead>
								<tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
									@for (customer of pagination.data; track customer.details.id) {

										<tr>
											<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
												{{ customer.details.firstName }} {{ customer.details.lastName }}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												{{ customer.details.registeredDate | date }}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												{{ customer.summary.total.serviceTimeInSeconds | humanizeDuration }}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												@for (done of customer.summary.revenue.total.by.status.done | keyvalue; track done.key) {
													@if (done.value) {
														{{ done.value | currency: done.key }}
													}
												}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												@for (done of customer.summary.revenue.average.by.status.done | keyvalue; track done.key) {
													@if (done.value) {
														{{ done.value | currency: done.key }}
													}
												}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												{{ customer.counter.orderService.total }}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												{{ customer.counter.orders.total }}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												@for (specialist of customer.specialistRecord | keyvalue; track specialist.key) {
													{{ specialist.value.details.firstName }} {{ specialist.value.details.lastName }}
<!--													{{ specialist.value.counter.orderService.total }}-->
												}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
												@for (service of customer.serviceRecord | keyvalue; track service.key) {
													{{ service.value.details.serviceName }}
<!--													{{ service.value.counter.orderService.total }}-->
												}
											</td>
										</tr>
									}
								</tbody>
							</table>
						</div>
						<div class="py-1 px-4">
							<!-- Pagination -->
							<nav class="flex items-center gap-x-1" aria-label="Pagination">
								<button type="button"
										(click)="previousPage()"
										class="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
										aria-label="Previous">
									<svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24"
										 height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="m15 18-6-6 6-6"></path>
									</svg>
									<span class="sr-only">Previous</span>
								</button>
								<div class="flex items-center gap-x-1">
									<span
										class="min-h-[38px] min-w-[38px] flex justify-center items-center border border-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-white dark:focus:bg-white/10">
										{{ currentPage }}
									</span>
									<span
										class="min-h-[38px] flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">of</span>
									<span
										class="min-h-[38px] flex justify-center items-center text-gray-500 py-2 px-1.5 text-sm dark:text-neutral-500">
										{{ availablePages }}
									</span>
								</div>
								<button type="button"
										(click)="nextPage()"
										class="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
										aria-label="Next">
									<span class="sr-only">Next</span>
									<svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24"
										 height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
										 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="m9 18 6-6-6-6"></path>
									</svg>
								</button>
							</nav>
							<!-- End Pagination -->
						</div>
					</div>
				</div>
			</div>
		</div>
	`
})
export class CustomerTableStatisticComponent implements OnChanges {

	public readonly customerRecord = input.required<{
    [customerId: string]: Analytic.ICustomer;
}>();

	public tableData: Analytic.ICustomer[] = [];

	public readonly pagination: {
		take: number;
		skip: number;
		total: number;
		data: Analytic.ICustomer[];
	} = {
		take: 6,
		skip: 0,
		total: 0,
		data: []
	};

	public ngOnChanges() {
		this.initTable();
	}

	public initTable() {
		this.tableData = Object.values(this.customerRecord());
		this.resetPagination();
	}

	public get availablePages() {
		return Math.ceil(this.tableData.length / this.pagination.take);
	}

	public get currentPage() {
		return Math.ceil(this.pagination.skip / this.pagination.take) + 1;
	}

	public resetPagination() {
		this.pagination.skip = 0;
		this.pagination.total = this.tableData.length;
		this.updatePaginationData();
	}

	public nextPage() {
		if (this.pagination.skip + this.pagination.take >= this.tableData.length) {
			return;
		}
		this.pagination.skip += this.pagination.take;
		this.updatePaginationData();
	}

	public previousPage() {
		if (this.pagination.skip === 0) {
			return;
		}
		this.pagination.skip -= this.pagination.take;
		this.updatePaginationData();
	}

	public updatePaginationData() {
		this.pagination.data = this.tableData.slice(this.pagination.skip, this.pagination.skip + this.pagination.take);
	}

}
