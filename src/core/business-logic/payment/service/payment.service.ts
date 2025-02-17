import {Injectable} from "@angular/core";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {BaseService} from "@core/shared/service/base.service";

type ENTITY = IPayment.Entity;

@Injectable()
export class PaymentService extends BaseService<ENTITY> {


}
