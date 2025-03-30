import {inject, Injectable} from "@angular/core";
import {State} from "@ngxs/store";
import {baseDefaults, IBaseState} from "@utility/state/base/base.state";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {NGXLogger} from "ngx-logger";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
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
	name: 'paymentPresentation',
	defaults,
})
@Injectable()
export class PaymentPresentationState {

	private readonly sharedUow = inject(SharedUow);
	private readonly ngxLogger = inject(NGXLogger);

}
