import {ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation} from "@angular/core";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {Store} from "@ngxs/store";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {TranslateModule} from "@ngx-translate/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {PaymentStatusEnum} from "@tenant/order/payment/domain/enum/payment.status.enum";
import {DynamicDatePipe} from "@shared/presentation/pipes/dynamic-date/dynamic-date.pipe";

@Component({
	standalone: true,
	selector: 'button-open-order-details',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
		DynamicDatePipe,
	],
	template: `

		<div class="flex justify-between font-bold">
			<div>{{ 'keyword.capitalize.orderInformation' | translate }}</div>
		</div>
		<div class="flex flex-col gap-3">
			<div class="flex gap-2 justify-between">
				<span class="text-neutral-500">{{ 'keyword.capitalize.numberOfServicesOrdered' | translate }}:</span>
				<span>{{ order().services.length }}</span>
			</div>
			<div class="flex gap-2 justify-between">
				<span class="text-neutral-500">{{ 'keyword.capitalize.status' | translate }}:</span>
				<span>{{ ('order.enum.status.singular.' + order().status) | translate }}</span>
			</div>
			<div class="flex gap-2 justify-between">
				<span class="text-neutral-500">{{ 'keyword.capitalize.createdAt' | translate }}:</span>
				<span>{{ order().createdAt | dynamicDate }}</span>
			</div>
			<div class="flex gap-2 justify-between">
				<span class="text-neutral-500">{{ 'keyword.capitalize.paymentStatus' | translate }}:</span>
				@if (payment(); as payment) {
					@if (payment.status === paymentStatusEnum.succeeded) {
						<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
						{{ 'keyword.capitalize.paid' | translate }}
					</span>
					} @else {
						<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
						{{ 'keyword.capitalize.notPaid' | translate }}
					</span>
					}
				} @else {
					<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-500">
						{{ 'keyword.capitalize.notPaid' | translate }}
					</span>
				}
			</div>
		</div>

		<button (click)="openOrderDetails()" type="button" class="p-2 transition-all rounded-lg border border-neutral-200 bg-white hover:bg-neutral-200 hover:border-neutral-300 flex justify-between">
			{{ 'order.keyword.singular.capitalize.openDetails' | translate }}
			<i class="bi bi-chevron-right"></i>
		</button>

	`,
	host: {
		class: 'p-4 w-full flex flex-col gap-3 border bg-neutral-100 rounded-2xl'
	}
})
export class ButtonOpenOrderDetailsComponent {

	public readonly order = input.required<IOrder.DTO>();

	public readonly payment = signal<IPayment.DTO | null>(null);

	public readonly store = inject(Store);
	private readonly sharedUow = inject(SharedUow);

	public readonly paymentStatusEnum = PaymentStatusEnum;

	public constructor() {
		effect(() => {
			this.initPayment().then();
		});
	}

	public async initPayment() {
		const {items: {0: payment}} = await this.sharedUow.payment.repository.findAsync({
			orderId: this.order()._id,
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		});
		this.payment.set(payment);
	}

	public openOrderDetails() {

		this.store.dispatch(new OrderActions.OpenDetails(this.order()));

	}

}
