import {ChangeDetectionStrategy, Component, effect, inject, input, signal, ViewEncapsulation} from "@angular/core";
import {IOrder} from "@src/core/business-logic/order/interface/i.order";
import {Store} from "@ngxs/store";
import {OrderActions} from "@order/infrastructure/state/order/order.actions";
import {TranslateModule} from "@ngx-translate/core";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {PaymentStatusEnum} from "@core/business-logic/payment/enum/payment.status.enum";

@Component({
	standalone: true,
	selector: 'button-open-order-details',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		TranslateModule,
	],
	template: `

		<div class="flex justify-between">
			<div>{{ 'sidebar.order' | translate }}</div>
			<div>{{ ('order.enum.status.singular.' + order().status) | translate }}</div>
		</div>
		<div class="flex justify-between">
			<div>{{ 'keyword.capitalize.services' | translate }}: {{ order().services.length }}</div>
<!--			<div>{{ order().createdAt | dynamicDate }}</div>-->
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
			}
		</div>

		<button (click)="openOrderDetails()" type="button" class="p-2 transition-all rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 flex justify-between">
			{{ 'order.keyword.singular.capitalize.openDetails' | translate }}
			<i class="bi bi-chevron-right"></i>
		</button>

	`,
	host: {
		class: 'p-4 w-full flex flex-col gap-2 border-b bg-white'
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
