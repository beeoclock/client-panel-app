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
        let payment = EPayment.fromDTO({
      providerPaymentRef: action.payload.providerPaymentRef ?? null,
      orderId: action.payload.orderId!,
            payer: action.payload.payer, // already DTO
      amount: action.payload.amount!,
      currency: action.payload.currency!,
      method: action.payload.method!,
      providerType: action.payload.providerType!,
      status: action.payload.status!,
      anchorType: action.payload.anchorType!,
      anchorId: action.payload.anchorId ?? null,
      paymentDate: action.payload.paymentDate!,
      _id: action.payload._id!,
      createdAt: action.payload.createdAt!,
      updatedAt: action.payload.updatedAt!,
      object: 'PaymentDto',
      state: action.payload.state!,
      _version: action.payload._version!,
      stateHistory: action.payload.stateHistory!,
    });
		const foundOrder = await this.sharedUow.order.repository.findByIdAsync(payment.orderId);
		if (!foundOrder) {
			throw new Error('Order not found');
		}
        let payer = CustomerForm.create({
            customerType: CustomerTypeEnum.anonymous,
        }).getRawValue() as any;
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
