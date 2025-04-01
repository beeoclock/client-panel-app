import {Injectable} from "@angular/core";
import {BasePushChangesSyncManager} from "@core/system/infrastructure/sync-manager/base.push.changes.sync-manager";
import EProduct from "@tenant/product/domain/entity/e.product";


@Injectable()
export class PushChangesSyncManager extends BasePushChangesSyncManager<EProduct> {

}
