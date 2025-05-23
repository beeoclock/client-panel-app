import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EPlugin from "@tenant/plugin/plugin/domain/entity/e.plugin-store";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EPlugin> {

}
