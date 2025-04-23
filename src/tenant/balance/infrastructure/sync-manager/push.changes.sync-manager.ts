import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EBalance from "@tenant/balance/domain/entity/e.balance";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EBalance> {

}
