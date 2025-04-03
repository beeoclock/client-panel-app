import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EOrderService from "@tenant/order-service/domain/entity/e.order-service";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EOrderService> {

}
