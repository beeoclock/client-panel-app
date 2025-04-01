import {inject, Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@shared/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {PaymentDataActions} from "@tenant/payment/infrastructure/state/data/payment.data.actions";
import EPayment from "@tenant/payment/domain/entity/e.payment";
import {NGXLogger} from "ngx-logger";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";
import {environment} from "@environment/environment";
import {SharedUow} from "@core/shared/uow/shared.uow";

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
		await this.sharedUow.payment.repository.createAsync(EPayment.fromDTO(action.payload));
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
