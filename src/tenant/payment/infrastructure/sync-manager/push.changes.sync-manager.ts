import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EPayment from "@tenant/payment/domain/entity/e.payment";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EPayment> {

}
