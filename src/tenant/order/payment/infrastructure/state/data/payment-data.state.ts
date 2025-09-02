import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {PaymentDataActions} from "@tenant/order/payment/infrastructure/state/data/payment.data.actions";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {NGXLogger} from "ngx-logger";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {CustomerForm} from "@tenant/customer/presentation/form";
import {CustomerTypeEnum} from "@tenant/customer/domain/enum/customer-type.enum";
import {AnchorTypeEnum} from "@tenant/order/payment/domain/enum/anchor.type.enum";
import {OrderActions} from "@tenant/order/order/infrastructure/state/order/order.actions";
import {OrderServiceStatusEnum} from "@tenant/order/order-service/domain/enum/order-service.status.enum";
import {OrderStatusEnum} from "@tenant/order/order/domain/enum/order.status.enum";

export type IPaymentState = IBaseState<IPayment.DTO>;

const defaults = baseDefaults<IPayment.DTO>({
	filters: {},
	orderBy: OrderByEnum.CREATED_AT,
	orderDir: OrderDirEnum.DESC,
	pageSize: environment.config.pagination.pageSize
});

@State<IPaymentState>({
	name: 'paymentData',
	defaults,
})
@Injectable()
export class PaymentDataState {

	private readonly sharedUow = inject(SharedUow);
	private readonly ngxLogger = inject(NGXLogger);

	@Action(PaymentDataActions.CreateItem)
	public async createItem(ctx: StateContext<IPaymentState>, action: PaymentDataActions.CreateItem) {
		let payment = EPayment.fromFormValue(action.payload);
		const foundOrder = await this.sharedUow.order.repository.findByIdAsync(payment.orderId);
		if (!foundOrder) {
			throw new Error('Order not found');
		}
		let payer = CustomerForm.create({
			customerType: CustomerTypeEnum.anonymous,
		}).getRawValue();
		try {
			const {0: {orderAppointmentDetails: {attendees: {0: {customer}}}}} = foundOrder.services;
			if (customer) {
				payer = customer;
			}
		} catch (e) {
			this.ngxLogger.error('Failed to extract customer from order services', e);
		}
		payment = EPayment.fromRaw({
			...payment,
			payer
		})
		await this.sharedUow.payment.repository.createAsync(payment);
		let orderAction: OrderActions.ChangeStatus | OrderActions.OrderedServiceStatus | null = null;
		switch (payment.anchorType) {
			case AnchorTypeEnum.order:
				orderAction = new OrderActions.ChangeStatus({
					item: foundOrder,
					status: OrderStatusEnum.done
				});
				break;
			case AnchorTypeEnum.service:
				orderAction = new OrderActions.OrderedServiceStatus(
					payment.orderId,
					payment.anchorId!,
					OrderServiceStatusEnum.done
				);
				break;
		}
		if (orderAction) ctx.dispatch(orderAction);
	}

	@Action(PaymentDataActions.Update)
	public async update(ctx: StateContext<IPaymentState>, {payload: {item}}: PaymentDataActions.Update): Promise<void> {
		const foundItems = await this.sharedUow.payment.repository.findByIdAsync(item._id);
		if (foundItems) {
			const entity = EPayment.fromRaw({
				...foundItems,
				...item,
			});
			await this.sharedUow.payment.repository.updateAsync(entity);
		}
	}
}
