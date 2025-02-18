import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {IOrder} from "@core/business-logic/order/interface/i.order";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<IOrder.Entity> {

}
