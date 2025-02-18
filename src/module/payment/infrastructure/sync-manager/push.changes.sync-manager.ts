import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<IPayment.Entity> {

}
