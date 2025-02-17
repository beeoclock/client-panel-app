import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";

@Injectable()
export class PaymentRepository extends BaseRepository<IPayment.Entity> {

}
