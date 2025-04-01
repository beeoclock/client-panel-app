import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EOrder from "@tenant/order/domain/entity/e.order";

@Injectable()
export class OrderRepository extends BaseRepository<EOrder> {

}
