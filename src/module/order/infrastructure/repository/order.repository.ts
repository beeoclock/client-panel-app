import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IOrder} from "@core/business-logic/order/interface/i.order";

@Injectable()
export class OrderRepository extends BaseRepository<IOrder.Entity> {

}
