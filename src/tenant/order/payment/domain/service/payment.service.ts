import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY_RAW = IPayment.EntityRaw;

export class PaymentService extends BaseService<ENTITY_RAW> {

	public async findByOrderId(payload: string) {
		const result = await this.db.filter((entity) => entity.orderId === payload).toArray();
		return result;
	}

}
