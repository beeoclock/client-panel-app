import {Injectable} from "@angular/core";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import EOrderService from "@tenant/order-service/domain/entity/e.order-service";

@Injectable()
export class OrderServiceRepository extends BaseRepository<EOrderService> {

}
