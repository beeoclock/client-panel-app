import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, KeyValuePipe} from "@angular/common";
import {
	OrderServiceStatusIconComponent
} from "@tenant/event/presentation/ui/page/calendar-with-specialists/v2/component/elements-on-calendar/icon/order-service-status-icon.component";
import {OrderServiceStatusEnum} from "@tenant/order/order/domain/enum/order-service.status.enum";
import {Analytic} from "@tenant/analytic/presentation/store/date-range-report/interface/i.analytic";

@Component({
	selector: 'total-statistic-component',
	template: `
		@if (summary) {
			<div class="rounded-2xl bg-neutral-100 p-2">
				<div class="uppercase text-neutral-400">
					Revenue by status
				</div>
				<div class="rounded-2xl bg-white p-2 flex flex-wrap gap-2">
					@for (status of summary.revenue.total.by.status | keyvalue; track status.key) {
						@for (currency of status.value | keyvalue; track currency.key) {
							@if (currency.value) {
								<div class="flex items-center justify-center gap-2 p-2">
									<div class="border p-2 rounded-2xl text-2xl">
										<app-order-service-status-icon-component class="flex items-center"
																   [status]="getStatus(status.key)"/>
									</div>
									<div>
										{{ currency.value | currency: currency.key: 'symbol-narrow' }}
									</div>
								</div>
							}
						}
					}
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
		OrderServiceStatusIconComponent
	]
})
export class TotalStatisticComponent {

	@Input({required: true})
	summary!: Analytic.ISummary;

	public getStatus(status: string): OrderServiceStatusEnum {
		return status as OrderServiceStatusEnum;
	}

}
