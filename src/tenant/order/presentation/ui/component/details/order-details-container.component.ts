import {Component, effect, inject, input, signal, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {DynamicDatePipe} from "@utility/presentation/pipes/dynamic-date/dynamic-date.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {EditButtonComponent} from "@utility/presentation/component/button/edit.button.component";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {OrderActions} from "@tenant/order/presentation/state/order/order.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	ContainerChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/container.change-status.button.component";
import {
	ListServiceFormCardOrderComponent
} from "@tenant/order/presentation/ui/component/list/card/item/services/list.service.form.card.order.component";
import {PaymentStatusEnum} from "@core/business-logic/payment/enum/payment.status.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";

@Component({
	selector: 'order-detail-page',
	templateUrl: './order-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		DynamicDatePipe,
		TranslateModule,
		EditButtonComponent,
		ContainerChangeStatusButtonComponent,
		ListServiceFormCardOrderComponent,
	],
	standalone: true
})
export class OrderDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<IOrder.DTO>();

	public readonly payment = signal<IPayment.DTO | null>(null);

	public readonly idPrefix = 'order-details-container';

	public readonly store = inject(Store);
	public readonly sharedUow = inject(SharedUow);

	public constructor() {
		effect(() => {
			this.preparePayment().then();
		});
	}

	private async preparePayment() {

		const item = this.item();
		if (!item) {
			return;
		}

		const {items: {0: payment}} = await this.sharedUow.payment.repository.findAsync({
			orderId: item._id,
			page: 1,
			pageSize: 1,
			orderBy: OrderByEnum.CREATED_AT,
			orderDir: OrderDirEnum.DESC,
		});

		this.payment.set(payment);

	}

	public openForm() {
		if (!this.item()) {
			return;
		}
		this.store.dispatch(new OrderActions.OpenFormToEditById(this.item()?._id));
	}

	protected readonly paymentStatusEnum = PaymentStatusEnum;
}
