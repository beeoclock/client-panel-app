import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EPayment from "@tenant/payment/domain/entity/e.payment";

@Injectable()
export class PaymentRepository extends BaseRepository<EPayment> {

}
