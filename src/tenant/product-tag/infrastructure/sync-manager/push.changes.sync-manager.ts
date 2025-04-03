import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EProductTag from "@tenant/product-tag/domain/entity/e.product-tag";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EProductTag> {

}
