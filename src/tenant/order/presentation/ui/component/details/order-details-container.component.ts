import {Component, effect, inject, input, signal, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngxs/store";
import {TranslateModule} from "@ngx-translate/core";
import {EditButtonComponent} from "@shared/presentation/component/button/edit.button.component";
import {OrderActions} from "@tenant/order/infrastructure/state/order/order.actions";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {
	ContainerChangeStatusButtonComponent
} from "@tenant/order/presentation/ui/component/details/change-status/container.change-status.button.component";
import {
	ListServiceFormCardOrderComponent
} from "@tenant/order/presentation/ui/component/list/card/item/services/list.service.form.card.order.component";
import {PaymentStatusEnum} from "@tenant/payment/domain/enum/payment.status.enum";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";
import {StandardDetailsEntityComponent} from "@shared/presentation/component/entity/standard-details.entity.component";
import EOrder from "@tenant/order/domain/entity/e.order";

@Component({
	selector: 'order-detail-page',
	templateUrl: './order-details-container.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		TranslateModule,
		EditButtonComponent,
		ContainerChangeStatusButtonComponent,
		ListServiceFormCardOrderComponent,
		StandardDetailsEntityComponent,
	],
	standalone: true
})
export class OrderDetailsContainerComponent {

	// TODO add base index of details with store and delete method

	public readonly item = input.required<EOrder>();

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
		const action = new OrderActions.OpenFormToEditById(this.item()?._id);
		this.store.dispatch(action);
	}

	protected readonly paymentStatusEnum = PaymentStatusEnum;
}

export default OrderDetailsContainerComponent;
