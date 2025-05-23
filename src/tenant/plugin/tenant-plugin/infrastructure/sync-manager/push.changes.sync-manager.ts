import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import ETenantPlugin from "@tenant/plugin/tenant-plugin/domain/entity/e.tenant-plugin";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<ETenantPlugin> {

}
