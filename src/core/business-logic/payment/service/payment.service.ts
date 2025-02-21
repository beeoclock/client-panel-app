import {Injectable} from "@angular/core";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY = IPayment.EntityRaw;

@Injectable()
export class PaymentService extends BaseService<ENTITY> {

	public async findByOrderId(payload: string) {
		const result = await this.db.filter((entity) => entity.orderId === payload).toArray();
		return result;
	}

}
