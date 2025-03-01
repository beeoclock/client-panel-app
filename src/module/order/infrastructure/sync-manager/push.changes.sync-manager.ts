import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EOrder from "@core/business-logic/order/entity/e.order";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EOrder> {

}
