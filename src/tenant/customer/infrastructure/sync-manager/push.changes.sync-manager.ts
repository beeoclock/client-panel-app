import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import ECustomer from "@tenant/customer/domain/entity/e.customer";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<ECustomer> {

}
